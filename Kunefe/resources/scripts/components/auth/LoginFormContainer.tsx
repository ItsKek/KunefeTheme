import React, { forwardRef } from 'react';
import { Form } from 'formik';
import styled from 'styled-components/macro';
import { breakpoint } from '@/theme';
import FlashMessageRender from '@/components/FlashMessageRender';
import tw from 'twin.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
  title?: string;
}

export default forwardRef<HTMLFormElement, Props>(({ title, ...props }, ref) => (
  <>
    <div css={tw`w-full h-full`} className="loginBackgroundImage">
      <div css={tw`flex flex-col justify-center items-center h-full`} className="container">
      <div className="container" css={tw`absolute w-full top-0 mt-3 pt-7`}>
        <div className="row">
          <div className="centerName pterodactylCredits">
            <a className="mobileBigger" href="https://pterodactyl.io" css={tw`uppercase font-semibold text-white`}>Pterodactyl</a>
          </div>
          <div className="companyInfo">
            <ul className="companyInfoHidden" css={tw`float-right flex flex-wrap pl-0 mb-0`}>
              <li>
                <a css={tw`flex items-center font-semibold text-white`}>
                <FontAwesomeIcon icon={faDiscord} />  <span css={tw`uppercase ml-2`}>Discord</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
        <FlashMessageRender css={tw`mb-2 px-1`} />
        <Form {...props} ref={ref}>
          <div css={tw`justify-center flex w-full rounded-lg`}>
            <div css={tw`w-full px-4 xl:w-1/4 xl:px-0`}>
              <div css={tw`flex-1`}>
                {props.children}
              </div>
            </div>
          </div>
        </Form>
        <div className="container" css={tw`fixed w-full bottom-0 mt-3 pb-14`}>
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
      </div>
    </div>
  </>
));
