import React, { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import koSlide1 from '../../assets/7f0d5f7953c0d037f05bc55d2319eb53ff4ccaf1.png';
import koSlide2 from '../../assets/3c67b8cc4359042ece28e45e6c99c51e3ec68302.png';
import enSlide1 from '../../assets/5ece5fd04f54ccc5e76c6d99c05a516f14467f50.png';
import enSlide2 from '../../assets/03dae936c2c8eefc1ba6d0bbdd1c839544469e75.png';

export function Newsletter() {
  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  const isKo = lang === 'ko';

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    appendDots: (dots: any) => (
      <div style={{ bottom: '10px' }}>
        <ul style={{ margin: '0px' }}> {dots} </ul>
      </div>
    ),
    customPaging: (i: number) => (
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          border: '1px solid #111',
          backgroundColor: '#fff',
          marginTop: '10px'
        }}
      />
    )
  };

  return (
    <div className="min-h-screen bg-neutral-100 py-8 flex items-center justify-center font-sans text-[#111] p-4">
      <div className="w-full max-w-[420px] bg-white border border-gray-300 overflow-hidden flex flex-col shadow-lg">
        
        {/* HEADER BAR */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#F9AF55] border-b-[9px] border-[#EA5514]">
          <svg width="28" height="39" viewBox="0 0 36 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-auto">
            <path d="M0 24.5952C0 9.91961 7.33964 0 18.9586 0C29.082 0 34.4494 7.13586 35.1298 16.4441H28.336C27.5209 9.98875 24.5989 5.23272 18.4819 5.23272C10.6001 5.23272 6.52453 12.7761 6.52453 24.5989C6.52453 36.4216 10.8039 44.5072 18.4819 44.5072C24.9373 44.5072 27.5864 40.2934 28.7436 33.2958H35.1298C34.0418 43.4884 28.7436 49.6708 18.6202 49.6708C6.7283 49.6708 0.00363967 39.955 0.00363967 24.5989L0 24.5952Z" fill="#111"/>
          </svg>
          <div className="flex-grow h-[3px] bg-[#111] mx-4"></div>
          <svg width="29" height="38" viewBox="0 0 37 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[29px] h-auto">
            <path d="M36.9456 9.47203H32.2078V7.10311C32.2078 5.68394 31.2617 4.73419 29.8389 4.73419H23.2088C21.7897 4.73419 20.8399 5.6803 20.8399 7.10311V40.257C20.8399 41.6762 21.786 42.6259 23.2088 42.6259H30.3119V47.3638H6.63004V42.6259H13.7332C15.156 42.6259 16.1021 41.6798 16.1021 40.257V7.10311C16.1021 5.68394 15.156 4.73419 13.7332 4.73419H7.10312C5.68031 4.73419 4.7342 5.6803 4.7342 7.10311V9.47203H0V0H36.942V9.47203H36.9456Z" fill="#111"/>
          </svg>
        </div>

        {/* LANG TOGGLE STRIP */}
        <div className="bg-[#E8E4D8] px-4 pt-1 pb-2 flex justify-end">
          <div className="inline-flex border-2 border-[#111] bg-white overflow-hidden shadow-sm">
            <button 
              onClick={() => setLang('ko')}
              className={`text-[11px] font-bold px-3 py-1 outline-none transition-colors ${isKo ? 'bg-[#111] text-white' : 'text-[#111] hover:bg-gray-100'}`}
            >
              KO
            </button>
            <div className="w-[2px] bg-[#111]"></div>
            <button 
              onClick={() => setLang('en')}
              className={`text-[11px] font-bold px-3 py-1 outline-none transition-colors ${!isKo ? 'bg-[#111] text-white' : 'text-[#111] hover:bg-gray-100'}`}
            >
              EN
            </button>
          </div>
        </div>

        {/* HERO */}
        <div className="bg-[#E8E4D8] px-5 pb-10 pt-4">
          <div className="text-[11px] font-bold tracking-[3px] uppercase mb-2">
            {isKo ? "반갑습니다, 창작자 여러분" : "Welcome, Creators"}
          </div>
          <div className="text-[46px] font-bold leading-none uppercase mb-4 tracking-tighter">
            CONTAC TO<br/>NEW UPDATES!
          </div>
          <div className="text-[15px] leading-[1.7] text-[#333] break-keep">
            {isKo ? (
              <>
                안녕하세요, 컨택토팀입니다.<br/>
                아트인굿즈를 통해 컨택토에 함께하게 되신 여러분을 진심으로 환영합니다. 오늘은 두 가지 중요한 소식을 전해드립니다.
              </>
            ) : (
              <>
                Hello, this is the Contacto team.<br/>
                We sincerely welcome everyone who has joined Contacto through Art in Goods. We have two important updates to share today.
              </>
            )}
          </div>
        </div>

        {/* BAND */}
        <div className="bg-[#C8D640] border-t-[9px] border-[#EA5514] px-5 py-2.5 text-[13px] font-bold uppercase tracking-[2px] whitespace-nowrap overflow-hidden text-[#111]">
          — 2026 UPDATE —&nbsp;&nbsp;&nbsp;— 2026 UPDATE —&nbsp;&nbsp;&nbsp;— 2026 UPDATE —&nbsp;&nbsp;&nbsp;— 2026 UPDATE —&nbsp;&nbsp;&nbsp;— 2026 UPDATE —
        </div>

        {/* SECTION 01 */}
        <div className="bg-[#E8E4D8] border-b-[3px] border-[#111] p-5 pt-6">
          <div className="text-[11px] font-bold tracking-[3px] uppercase mb-2">
            01 / News Update
          </div>
          <div className="text-[30px] font-bold leading-[1.05] uppercase mb-4 tracking-tight">
            {isKo ? (
              <>브랜드사 &amp; 미술관<br/>공식 프로젝트<br/>시작됩니다</>
            ) : (
              <>OFFICIAL PROJECTS<br/>WITH BRANDS &amp;<br/>MUSEUMS BEGIN</>
            )}
          </div>
          <div className="text-[14px] leading-[1.8] text-[#222] space-y-3 break-keep">
            {isKo ? (
              <>
                <p>조만간 다양한 창작자 수요가 있는 브랜드사, 기업, 미술관들과 연결된 프로젝트들이 컨택토 안에서 선보일 예정입니다. 수익이 보장되고 포트폴리오로서의 가치도 있는 프로젝트들입니다.</p>
                <p>컨택토 내 <strong className="text-[#111]">초록색 프로필 콜라보레이션</strong>을 통해 만나보실 수 있습니다. 번거로운 제안서 작성 없이 간편하게 신청하실 수 있습니다.</p>
              </>
            ) : (
              <>
                <p>Soon, projects connected with brands, companies, and museums that have diverse creator needs will be introduced within Contacto. These are projects with guaranteed income and real portfolio value.</p>
                <p>You can discover them through the <strong className="text-[#111]">green profile collaboration</strong> within Contacto. Apply easily ��� no proposal writing required.</p>
              </>
            )}
          </div>

          <div className="bg-[#2EA7E0] border border-[#111] p-4 my-4 text-[#111]">
            <div className="text-[11px] font-bold tracking-[3px] uppercase mb-2">
              {isKo ? "⚠ 포트폴리오 업로드 안내" : "⚠ Portfolio Upload Notice"}
            </div>
            <div className="text-[13px] leading-[1.7] break-keep">
              {isKo ? (
                <>
                  4월부터 컨택토는 <strong className="text-[#111]">승인제로 전환</strong>됩니다. 승인제 시행 이후에는 포트폴리오가 없는 계정은 자동으로 탈퇴 처리될 예정입니다.<br/><br/>
                  승인제가 시작되기 전까지 포트폴리오를 업로드해 주시면 감사하겠습니다.
                </>
              ) : (
                <>
                  Starting in April, Contacto will switch to an <strong className="text-[#111]">approval-based system</strong>. After implementation, accounts without a portfolio will be automatically deactivated.<br/><br/>
                  Please upload your portfolio before the approval system goes live.
                </>
              )}
            </div>
          </div>

          <div className="text-[12px] text-[#888] break-keep">
            {isKo ? "해당 기능은 현재 개발 중이며 4월 중 오픈 예정입니다." : "This feature is currently in development and will launch in April."}
          </div>
        </div>

        {/* SECTION 02 */}
        <div className="bg-[#E8E4D8] p-5 pt-6 pb-0">
          <div className="text-[11px] font-bold tracking-[3px] uppercase mb-2">
            02 / Update
          </div>
          <div className="text-[30px] font-bold leading-[1.05] uppercase mb-4 tracking-tight">
            {isKo ? (
              <>콜라보레이션<br/>기능이<br/>업데이트됐습니다</>
            ) : (
              <>COLLABORATION<br/>FEATURE<br/>UPDATED</>
            )}
          </div>

          <div className="flex flex-wrap gap-2 my-3.5">
            {isKo ? (
              <>
                <span className="text-[11px] font-bold uppercase tracking-[2px] border-2 border-[#111] px-2.5 py-1 bg-[#E8E4D8] text-[#111]">팀원 모집</span>
                <span className="text-[11px] font-bold uppercase tracking-[2px] border-2 border-[#111] px-2.5 py-1 bg-[#E8E4D8] text-[#111]">팝업 동료</span>
                <span className="text-[11px] font-bold uppercase tracking-[2px] border-2 border-[#111] px-2.5 py-1 bg-[#E8E4D8] text-[#111]">스와이프 지원</span>
              </>
            ) : (
              <>
                <span className="text-[11px] font-bold uppercase tracking-[2px] border-2 border-[#111] px-2.5 py-1 bg-[#E8E4D8] text-[#111]">Team Recruitment</span>
                <span className="text-[11px] font-bold uppercase tracking-[2px] border-2 border-[#111] px-2.5 py-1 bg-[#E8E4D8] text-[#111]">Popup Partner</span>
                <span className="text-[11px] font-bold uppercase tracking-[2px] border-2 border-[#111] px-2.5 py-1 bg-[#E8E4D8] text-[#111]">Swipe to Apply</span>
              </>
            )}
          </div>

          <div className="text-[14px] leading-[1.8] text-[#222] space-y-3 break-keep mt-4 mb-6">
            {isKo ? (
              <>
                <p>기존 1:1 매칭 방식의 불편함을 개선하여, 이제 하나의 주제 아래 여러 구성원을 모을 수 있는 <strong className="text-[#111]">콜렉티브 빌드 기능</strong>이 추가되었습니다.</p>
                <p>앱 하단 가운데 버튼을 눌러 콜렉티브 프로필을 만들고 홈피드에 업로드할 수 있습니다.</p>
                <p>홈피드에서 마음에 드는 콜라보레이션을 발견하면, <strong className="text-[#111]">스와이프 한 번으로 바로 지원</strong>할 수 있습니다.</p>
              </>
            ) : (
              <>
                <p>Improving on the 1:1 matching method, a <strong className="text-[#111]">Collective Build feature</strong> has been added — gather multiple members under a single theme.</p>
                <p>Tap the center button at the bottom of the app to create a collective profile and post it to the home feed.</p>
                <p>When you find a collaboration you like on the home feed, <strong className="text-[#111]">apply instantly with a single swipe</strong>.</p>
              </>
            )}
          </div>
        </div>

        {/* IMAGE CAROUSEL SLIDER */}
        <div className="w-full bg-[#E8E4D8] pb-10 pt-2">
          <div className="w-[90%] mx-auto relative overflow-hidden h-[500px] newsletter-slider">
            <style>{`
              .newsletter-slider .slick-dots li.slick-active div {
                background-color: #111 !important;
              }
            `}</style>
            <Slider {...settings} key={lang}>
              <div className="w-full h-[500px] relative outline-none">
                <ImageWithFallback 
                  src={isKo ? koSlide1 : enSlide1}
                  alt="Collective Build Slide 1"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-full h-[500px] relative outline-none">
                <ImageWithFallback 
                  src={isKo ? koSlide2 : enSlide2}
                  alt="Collective Build Slide 2"
                  className="w-full h-full object-contain"
                />
              </div>
            </Slider>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#C8D640] border-t-[9px] border-[#EA5514] p-5 py-7 flex flex-col items-start">
          <div className="text-[34px] font-bold uppercase leading-none mb-3 tracking-tight text-[#111]">
            {isKo ? (
              <>지금 포트폴리오를<br/>업로드하세요</>
            ) : (
              <>UPLOAD YOUR<br/>PORTFOLIO NOW</>
            )}
          </div>
          <div className="text-[14px] leading-[1.7] text-[#333] mb-5 break-keep">
            {isKo 
              ? "4월 승인제 전환 전까지 포트폴리오를 등록하셔야 컨택토 안에서 계속 활동하실 수 있습니다." 
              : "Register your portfolio before the April approval transition to continue your activity on Contacto."}
          </div>
          <button 
            onClick={() => {
              if (typeof window === 'undefined') return;
              const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
              if (/android/i.test(userAgent)) {
                window.open("https://play.google.com/store/apps/details?id=com.contacto.contactoandroid", "_blank");
              } else {
                window.open("https://apps.apple.com/kr/app/contacto/id6736873767", "_blank");
              }
            }}
            className="inline-flex text-[13px] font-bold uppercase tracking-[2px] bg-[#111] text-[#C8D640] py-3 px-6 border-[3px] border-[#111] hover:bg-[#222] transition-colors items-center justify-center"
          >
            {isKo ? "포트폴리오 업로드 →" : "Upload Portfolio →"}
          </button>
        </div>

        {/* FOOTER */}
        <div className="bg-[#E8E4D8] p-5">
          <div className="text-[22px] font-bold text-[#111] tracking-[3px] uppercase mb-2">
            CONTACTO
          </div>
          <div className="text-[12px] leading-[1.7] text-[#555] break-keep">
            {isKo ? (
              <>
                앞으로도 컨택토는 창작자 여러분의 연결과 성장을 위해<br/>계속 업데이트해 나가겠습니다.<br/>
                컨택토팀 드림
              </>
            ) : (
              <>
                Contacto will keep updating to support the connection and growth of all creators.<br/>
                Sincerely, the Contacto Team
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
