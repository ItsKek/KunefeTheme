import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Terminal, ITerminalOptions } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { SearchAddon } from 'xterm-addon-search';
import { SearchBarAddon } from 'xterm-addon-search-bar';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { ScrollDownHelperAddon } from '@/plugins/XtermScrollDownHelperAddon';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Button from '@/components/elements/Button';
import { ServerContext } from '@/state/server';
import styled from 'styled-components/macro';
import { usePermissions } from '@/plugins/usePermissions';
import tw, { theme as th, TwStyle } from 'twin.macro';
import 'xterm/css/xterm.css';
import useEventListener from '@/plugins/useEventListener';
import { debounce } from 'debounce';
import { usePersistedState } from '@/plugins/usePersistedState';
import { SocketEvent, SocketRequest } from '@/components/server/events';
import { faCircle, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PowerAction } from '@/components/server/ServerConsole';
import Can from '@/components/elements/Can';

function statusToColor(status: string | null, installing: boolean): TwStyle {
  if (installing) {
    status = '';
  }

  switch (status) {
    case 'offline':
      return tw`text-red-915`;
    case 'running':
      return tw`text-green-920`;
    default:
      return tw`text-yellow-905`;
  }
}

const theme = {
  background: th`colors.black`.toString(),
  cursor: 'transparent',
  black: th`colors.black`.toString(),
  red: '#E54B4B',
  green: '#9ECE58',
  yellow: '#FAED70',
  blue: '#396FE2',
  magenta: '#BB80B3',
  cyan: '#2DDAFD',
  white: '#d0d0d0',
  brightBlack: 'rgba(255, 255, 255, 0.2)',
  brightRed: '#FF5370',
  brightGreen: '#C3E88D',
  brightYellow: '#FFCB6B',
  brightBlue: '#82AAFF',
  brightMagenta: '#C792EA',
  brightCyan: '#89DDFF',
  brightWhite: '#ffffff',
  selection: '#5e72e4',
};

const terminalProps: ITerminalOptions = {
  disableStdin: true,
  cursorStyle: 'underline',
  allowTransparency: true,
  fontSize: 11.5,
  fontFamily: "'Source Code Pro', monospace",
  rows: 30,
  theme: theme,
  letterSpacing: .6,
  lineHeight: .2,
};

const TerminalDiv = styled.div`
    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-thumb {
        ${tw`bg-neutral-900`};
    }
`;

const CommandInput = styled.input`
    ${tw`text-sm border-0 focus:ring-0`}
`;

export default () => {
  const TERMINAL_PRELUDE = '\u001b[1m\u001b[33mcontainer@pterodactyl~ \u001b[0m';
  const ref = useRef<HTMLDivElement>(null);
  const name = ServerContext.useStoreState(state => state.server.data!.name);
  const terminal = useMemo(() => new Terminal({ ...terminalProps }), []);
  const fitAddon = new FitAddon();
  const searchAddon = new SearchAddon();
  const searchBar = new SearchBarAddon({ searchAddon });
  const webLinksAddon = new WebLinksAddon();
  const scrollDownHelperAddon = new ScrollDownHelperAddon();
  const { connected, instance } = ServerContext.useStoreState(state => state.socket);
  const [canSendCommands] = usePermissions(['control.console']);
  const serverId = ServerContext.useStoreState(state => state.server.data!.id);
  const isTransferring = ServerContext.useStoreState(state => state.server.data!.isTransferring);
  const [history, setHistory] = usePersistedState<string[]>(`${serverId}:command_history`, []);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const status = ServerContext.useStoreState(state => state.status.value);
  const isInstalling = ServerContext.useStoreState(state => state.server.data!.isInstalling);

  const sendPowerCommand = (command: PowerAction) => {
      instance && instance.send('set state', command);
  };

  const handleConsoleOutput = (line: string, prelude = false) => terminal.writeln(
    (prelude ? TERMINAL_PRELUDE : '') + line.replace(/(?:\r\n|\r|\n)$/im, '') + '\u001b[0m',
  );

  const handleTransferStatus = (status: string) => {
    switch (status) {
      // Sent by either the source or target node if a failure occurs.
      case 'failure':
        terminal.writeln(TERMINAL_PRELUDE + 'Transfer has failed.\u001b[0m');
        return;

      // Sent by the source node whenever the server was archived successfully.
      case 'archive':
        terminal.writeln(TERMINAL_PRELUDE + 'Server has been archived successfully, attempting connection to target node..\u001b[0m');
    }
  };

  const handleDaemonErrorOutput = (line: string) => terminal.writeln(
    TERMINAL_PRELUDE + '\u001b[1m\u001b[41m' + line.replace(/(?:\r\n|\r|\n)$/im, '') + '\u001b[0m',
  );

  const handlePowerChangeEvent = (state: string) => terminal.writeln(
    TERMINAL_PRELUDE + 'Server marked as ' + state + '...\u001b[0m',
  );

  const handleCommandKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      const newIndex = Math.min(historyIndex + 1, history!.length - 1);

      setHistoryIndex(newIndex);
      e.currentTarget.value = history![newIndex] || '';

      // By default up arrow will also bring the cursor to the start of the line,
      // so we'll preventDefault to keep it at the end.
      e.preventDefault();
    }

    if (e.key === 'ArrowDown') {
      const newIndex = Math.max(historyIndex - 1, -1);

      setHistoryIndex(newIndex);
      e.currentTarget.value = history![newIndex] || '';
    }

    const command = e.currentTarget.value;
    if (e.key === 'Enter' && command.length > 0) {
      setHistory(prevHistory => [command, ...prevHistory!].slice(0, 32));
      setHistoryIndex(-1);

      instance && instance.send('send command', command);
      e.currentTarget.value = '';
    }
  };

  useEffect(() => {
    if (connected && ref.current && !terminal.element) {
      terminal.loadAddon(fitAddon);
      terminal.loadAddon(searchAddon);
      terminal.loadAddon(searchBar);
      terminal.loadAddon(webLinksAddon);
      terminal.loadAddon(scrollDownHelperAddon);

      terminal.open(ref.current);
      fitAddon.fit();

      // Add support for capturing keys
      terminal.attachCustomKeyEventHandler((e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
          document.execCommand('copy');
          return false;
        } else if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
          e.preventDefault();
          searchBar.show();
          return false;
        } else if (e.key === 'Escape') {
          searchBar.hidden();
        }
        return true;
      });
    }
  }, [terminal, connected]);

  useEventListener('resize', debounce(() => {
    if (terminal.element) {
      fitAddon.fit();
    }
  }, 100));

  useEffect(() => {
    const listeners: Record<string, (s: string) => void> = {
      [SocketEvent.STATUS]: handlePowerChangeEvent,
      [SocketEvent.CONSOLE_OUTPUT]: handleConsoleOutput,
      [SocketEvent.INSTALL_OUTPUT]: handleConsoleOutput,
      [SocketEvent.TRANSFER_LOGS]: handleConsoleOutput,
      [SocketEvent.TRANSFER_STATUS]: handleTransferStatus,
      [SocketEvent.DAEMON_MESSAGE]: line => handleConsoleOutput(line, true),
      [SocketEvent.DAEMON_ERROR]: handleDaemonErrorOutput,
    };

    if (connected && instance) {
      // Do not clear the console if the server is being transferred.
      if (!isTransferring) {
        terminal.clear();
      }

      Object.keys(listeners).forEach((key: string) => {
        instance.addListener(key, listeners[key]);
      });
      instance.send(SocketRequest.SEND_LOGS);
    }

    return () => {
      if (instance) {
        Object.keys(listeners).forEach((key: string) => {
          instance.removeListener(key, listeners[key]);
        });
      }
    };
  }, [connected, instance]);

  return (
    <>
      <div className="row">
        <div className="flexGrow" />
      </div>
      <div className="row">
        <SpinnerOverlay visible={!connected} size={'large'} />
        <div className="consoleContainer">
          <div className="card">
            <div css="min-height: 81px; background: var(--other);" className="alert card-header">
              <h1 css={tw`mb-0`}>
                <FontAwesomeIcon
                  icon={faCircle}
                  fixedWidth
                  css={[
                    statusToColor(status, isInstalling || isTransferring),
                  ]}
                />
                <span css={tw`text-white`}>
                  &nbsp;{!status ? 'Connecting...' : (isInstalling ? 'Installing' : (isTransferring) ? 'Transferring' : status).charAt(0).toUpperCase() + (status).slice(1)}
                </span>
                <FontAwesomeIcon
                  icon={faAngleRight}
                  fixedWidth
                  css={tw`ml-1 text-xl font-black`}
                />
                <span css={tw`text-white`}>{name}</span>
              </h1>
            </div>
            <div css="height: 572px; position: relative;" className="card-body">
              <TerminalDiv id={'terminal'} ref={ref} />
              {canSendCommands &&
                  <CommandInput
                    id="terminal_input"
                    type={'text'}
                    placeholder={'send-command:'}
                    disabled={!instance || !connected}
                    onKeyDown={handleCommandKeyDown}
                  />
              }
            </div>
            <div css={tw`bg-neutral-910 text-center mt-4`} className="card-footer">
            <Can action={'control.start'}>
                <Button
                    size={'small'}
                    color={'start'}
                    css="margin: .5rem; width: 76.63px; height: 43px;"
                    disabled={status !== 'offline'}
                    onClick={e => {
                        e.preventDefault();
                        sendPowerCommand('start');
                    }}
                >
                    Start
                </Button>
            </Can>
            <Can action={'control.restart'}>
                <Button
                    size={'small'}
                    color={'purple'}
                    css="margin: .5rem; width: 93.45px; height: 43px;"
                    disabled={!status}
                    onClick={e => {
                        e.preventDefault();
                        sendPowerCommand('restart');
                    }}
                >
                    Restart
                </Button>
            </Can>
            <Can action={'control.restart'}>
                <Button
                    size={'small'}
                    color={'stop'}
                    css="margin: .5rem; width: 73.88px; height: 43px;"
                    disabled={!status || status === 'offline'}
                    onClick={e => {
                        e.preventDefault();
                        sendPowerCommand('stop');
                    }}
                >
                    Stop
                </Button>
            </Can>
            <Can action={'control.restart'}>
                <Button
                    size={'small'}
                    color={'stop'}
                    css="margin: .5rem; width: 116.66px; height: 43px;"
                    disabled={!status || status === 'offline'}
                    onClick={e => {
                        e.preventDefault();
                        sendPowerCommand('kill');
                    }}
                >
                    Force Stop
                </Button>
            </Can>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
