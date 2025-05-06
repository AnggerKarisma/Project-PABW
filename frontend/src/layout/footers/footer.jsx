import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// internal
import logo from '@assets/img/logo/MahakamStoreLogo.png';
import pay from '@assets/img/footer/footer-pay.png';
import social_data from '@/data/social-data';
import { Email, Location } from '@/svg';

const Footer = ({ style_2 = false, style_3 = false,primary_style=false }) => {
  return (
    <footer>
      <div className={`tp-footer-area ${primary_style?'tp-footer-style-2 tp-footer-style-primary tp-footer-style-6':''} ${style_2 ?'tp-footer-style-2':style_3 ? 'tp-footer-style-2 tp-footer-style-3': ''}`}
        data-bg-color={`${style_2 ? 'footer-bg-white' : 'footer-bg-grey'}`}>
        <div className="tp-footer-top pt-95 pb-40">
          <div className="container">
            <div className="row">
              <div className="col-xl-4 col-lg-3 col-md-4 col-sm-6">
                <div className="tp-footer-widget footer-col-1 mb-50">
                  <div className="tp-footer-widget-content">
                    <div className="tp-footer-logo">
                      <Link href="/">
                        <Image src={logo} alt="logo" width={90} height={80} />
                        <span className="logo-text" style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>Mahakam Store</span>
                      </Link>
                    </div>
                    <p className="tp-footer-desc">Dunia Belanja Anda</p>
                    <div className="tp-footer-social">
                      {social_data.map(s => <a href={s.link} key={s.id} target="_blank">
                        <i className={s.icon}></i>
                      </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                <div className="tp-footer-widget footer-col-2 mb-50">
                  <h4 className="tp-footer-widget-title">Akunku</h4>
                  <div className="tp-footer-widget-content">
                    <ul>
                    <li><a href="#">Lacak Pesanan</a></li>
<li><a href="#">Pengiriman</a></li>
<li><a href="#">Daftar Keinginan</a></li>
<li><a href="#">Akun Saya</a></li>
<li><a href="#">Riwayat Pesanan</a></li>
<li><a href="#">Pengembalian</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6">
                <div className="tp-footer-widget footer-col-3 mb-50">
                  <h4 className="tp-footer-widget-title">Informasi</h4>
                  <div className="tp-footer-widget-content">
                    <ul>
                    <li><a href="#">Tentang Kami</a></li>
<li><a href="#">Karier</a></li>
<li><a href="#">Kebijakan Privasi</a></li>
<li><a href="#">Syarat & Ketentuan</a></li>
<li><a href="#">Berita Terbaru</a></li>
<li><a href="#">Hubungi Kami</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6">
                <div className="tp-footer-widget footer-col-4 mb-50">
                  <h4 className="tp-footer-widget-title">Talk To Us</h4>
                  <div className="tp-footer-widget-content">
                    <div className="tp-footer-talk mb-20">
                      <span>Mau Nanya? Telepon saja kami</span>
                      <h4><a href="tel:670-413-90-762">+62895342503504</a></h4>
                    </div>
                    <div className="tp-footer-contact">
                      <div className="tp-footer-contact-item d-flex align-items-start">
                        <div className="tp-footer-contact-icon">
                          <span>
                            <Email />
                          </span>
                        </div>
                        <div className="tp-footer-contact-content">
                          <p><a href="mailto:shofy@support.com">mahakamstore@gmail.com</a></p>
                        </div>
                      </div>
                      <div className="tp-footer-contact-item d-flex align-items-start">
                        <div className="tp-footer-contact-icon">
                          <span>
                            <Location />
                          </span>
                        </div>
                        <div className="tp-footer-contact-content">
                          <p><a href="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3111.2237541094855!2d116.8596086736463!3d-1.149944135489543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2df149298f826ab5%3A0x8489d5309f45c0db!2sKalimantan%20Institute%20of%20Technology!5e1!3m2!1sen!2sid!4v1746503762238!5m2!1sen!2sid" target="_blank">Kampus ITK <br />Karang Joang, Balikpapan</a></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tp-footer-bottom">
          <div className="container">
            <div className="tp-footer-bottom-wrapper">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="tp-footer-copyright">
                    <p>© {new Date().getFullYear()} All Rights Reserved  |  React js by Kelompok 5 PABW
                    </p>
                  </div>
                </div>
                              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;