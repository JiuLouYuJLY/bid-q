import {memo} from "react";
import './Footer.less'

const  Footer = memo(() => {
  return (
    <footer className='bid-q-footer-container'>
      <p className='text-gray-400 text-center text-sm select-none'>
        Powered by{' '}
        <a href='#' style={{ color: '#ceb7d5' }}>
          JiuLouYu
        </a>
      </p>
      <p className='text-gray-400 text-center text-sm select-none'>© 2025 Bid Quick. All Rights Reserved.</p>
    </footer>
  )
});

export default Footer;