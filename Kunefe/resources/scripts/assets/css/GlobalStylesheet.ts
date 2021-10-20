import tw from 'twin.macro';
import { createGlobalStyle } from 'styled-components/macro';

export default createGlobalStyle`
body {
	${tw`bg-neutral-915 text-white`};
	font-family: "Open Sans",
	sans-serif !important;
	overflow: overlay !important;
}

.bg-info {
  background-color: var(--info) !important;
}

code {
  font-size: 87.5%;
  color: var(--code);
  word-break: break-word;
}

p {
  ${tw`text-white leading-snug`};
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.7;
  margin-top: 0;
  margin-bottom: 1rem;
}

form {
  ${tw`m-0`};
}

textarea,
select,
input,
button,
button:focus,
button:focus-visible {
  ${tw`outline-none`};
}

input:focus,
select:focus,
textarea:focus,
button:focus {
  box-shadow: none !important;
  -moz-box-shadow: none !important;
  -webkit-box-shadow: none !important;
}

input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield !important;
}

/* Scroll Bar Style */
::-webkit-scrollbar {
  background: none;
  width: 16px;
  height: 16px;
}

::-webkit-scrollbar-thumb {
  border: solid 0 rgb(0 0 0 / 0%);
  border-right-width: 4px;
  border-left-width: 4px;
  -webkit-border-radius: 9px 4px;
  -webkit-box-shadow: inset 0 0 0 1px var(--purple), inset 0 0 0 4px var(--purple);
}

::-webkit-scrollbar-track-piece {
  margin: 4px 0;
}

::-webkit-scrollbar-thumb:horizontal {
  border-right-width: 0;
  border-left-width: 0;
  border-top-width: 4px;
  border-bottom-width: 4px;
  -webkit-border-radius: 4px 9px;
}

::-webkit-scrollbar-thumb:hover {
  -webkit-box-shadow: inset 0 0 0 1px var(--purple), inset 0 0 0 4px var(--purple);
}

::-webkit-scrollbar-corner {
  background: transparent;
}

.infoIcon {
  color: var(--infoIconColor);
  background: var(--infoIconBackground);
}

.link,
.bigLabel,
.statusBox,
.allocationBox,
h1,
h2,
h3,
h4,
h5,
h6,
.h1,
.h2,
.h3,
.h4,
.h5,
.h6 {
  color: var(--textColor);
}

.serverIcon {
  background: var(--mainIconBackground);
  color: var(--mainIconColor);
}

.text-muted,
.nav-link {
  color: var(--textMuted) !important;
}

.text-light {
  color: var(--textLight) !important;
}

.alert-info {
  color: var(--textColor);
  background-color: var(--border);
  border-color: var(--secondary);
}

.alert-danger {
  color: var(--textColor);
  background-color: var(--danger);
  border-color: var(--danger);
}

.minecraftHeader {
  background: url(https://media.discordapp.net/attachments/829559569071996968/869164632911261736/minecraft.png);
}

.loginBackgroundImage {
  background: url(https://media.discordapp.net/attachments/829559572951203861/869087432597987399/headerbg.png);
}

.table th,
.table td {
  border-top: 1px solid var(--border);
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-text-fill-color: var(--textColor);
  -webkit-box-shadow: 0 0 0 30px var(--other) inset !important;
}

.card,
.secondaryNav {
  background-color: var(--secondary);
}

.card-header {
  background-color: var(--secondary);
  border-bottom: 1px solid var(--border);
}

.card-footer {
  background-color: var(--secondary);
  border-top: 1px solid var(--border);
}

.fileRowTh {
  border-bottom: 1px solid var(--border);
}

.FileObjectRowItems {
  border-top: 1px solid var(--border);
}

.FileObjectRow:hover {
  background: var(--other);
}

tr:hover {
  background: var(--other);
}

.inputSelect {
  background-color: var(--other);
  color: rgba(255, 255, 255, var(--tw-text-opacity));
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

[type='checkbox']:checked,
[type='checkbox']:checked:hover, [type='checkbox']:checked:focus, [type='radio']:checked:hover, [type='radio']:checked:focus {
  background-color: var(--purple) !important;
}

[type="checkbox"], [type="radio"] {
  border-color: var(--textColor) !important;
  background: transparent !important;
}
`;
