import React, { useEffect } from 'react';
import ContentContainer from '@/components/elements/ContentContainer';
import { CSSTransition } from 'react-transition-group';
import tw from 'twin.macro';
import FlashMessageRender from '@/components/FlashMessageRender';

export interface PageContentBlockProps {
    title?: string;
    className?: string;
    showFlashKey?: string;
}

const PageContentBlock: React.FC<PageContentBlockProps> = ({ title, showFlashKey, className, children }) => {
    useEffect(() => {
        if (title) {
            document.title = title;
        }
    }, [ title ]);

    return (
        <CSSTransition timeout={150} classNames={'fade'} appear in>
            <>
                <ContentContainer css={tw`mt-4 sm:mt-10`} className={className}>
                    {showFlashKey &&
                    <FlashMessageRender byKey={showFlashKey} css={tw`mb-4`}/>
                    }
                    {children}
                </ContentContainer>
                <div className="container" css={tw`relative w-full bottom-0 py-4 mt-3`}>
                  <div className="row">
                    <div className="pterodactylCredits">
                      <span className="text-muted">© 2021</span><a href="https://pterodactyl.io" css={tw`font-semibold text-white`}> Pterodactyl</a>
                    </div>
                    <div className="companyInfo">
                      <ul className="companyInfoLeft" css={tw`float-right flex flex-wrap pl-0 mb-0`}>
                        <li>
                          <a className="nav-link">
                            About Us
                          </a>
                        </li>
                        <li>
                          <a className="nav-link">
                            Privacy Policy
                          </a>
                        </li>
                        <li>
                          <a className="nav-link">
                            Service Agreement
                          </a>
                        </li>
                        <li>
                          <a className="nav-link">
                            Contact
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
            </>
        </CSSTransition>
    );
};

export default PageContentBlock;
