import svgPaths from "./svg-gpq17iryin";

function Heading() {
  return (
    <div className="h-[28.5px] relative shrink-0 w-[89.438px]" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[28.5px] relative w-[89.438px]">
        <p className="absolute font-['Arimo:Bold',_sans-serif] font-bold leading-[28.5px] left-0 text-[19px] text-black text-nowrap top-[-2px] whitespace-pre">Meu perfil</p>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[29.17%_12.5%_29.17%_66.67%]" data-name="Vector">
        <div className="absolute inset-[-10%_-20%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 10">
            <path d={svgPaths.p6680d80} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/2 left-[37.5%] right-[12.5%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.83px_-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 2">
            <path d="M10.8333 0.833333H0.833333" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_62.5%_12.5%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-5.56%_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 17">
            <path d={svgPaths.p297e5680} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="relative rounded-[10px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start pb-0 pt-[6px] px-[6px] relative size-[32px]">
        <Icon />
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="h-[29px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.41%_12.68%]" data-name="Vector">
        <div className="absolute inset-[-5.01%_-5.58%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 27">
            <path d={svgPaths.p2daaaa50} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.41667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.667%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.p1caee780} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.41667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="basis-0 grow h-[41px] min-h-px min-w-px relative rounded-[10px] shrink-0" data-name="Button">
      <div className="size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[41px] items-start pb-0 pt-[6px] px-[6px] relative w-full">
          <Icon1 />
        </div>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[41px] relative shrink-0 w-[85px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[12px] h-[41px] items-center relative w-[85px]">
        <Button />
        <Button1 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex h-[51px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Heading />
      <Container />
    </div>
  );
}

function Header() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col h-[52px] items-start left-0 pb-px pt-0 px-[161px] top-0 w-[1554px]" data-name="Header">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(0,0,0,0.3)] border-solid inset-0 pointer-events-none" />
      <Container1 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[17px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Arimo:Bold',_sans-serif] font-bold leading-[27px] left-0 text-[32px] text-black top-[7px] w-[296px]">Visão geral</p>
    </div>
  );
}

function Heading2() {
  return <div className="h-[22.5px] shrink-0 w-full" data-name="Heading 3" />;
}

function Icon2() {
  return (
    <div className="h-[32px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[33.33%_8.33%_8.33%_8.33%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 19">
          <path d={svgPaths.p2b463c80} fill="var(--fill-0, #0056B9)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[8.33%_37.5%_66.67%_37.5%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <path d={svgPaths.p34c2d130} fill="var(--fill-0, #0056B9)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex flex-col h-[32px] items-start left-0 top-[4px] w-[29px]" data-name="Container">
      <Icon2 />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[21px] left-0 text-[14px] text-black text-nowrap top-[-1px] whitespace-pre">Alunos ativos</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[31.5px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[31.5px] left-0 text-[#0056b9] text-[21px] text-nowrap top-[-3px] whitespace-pre">19</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[60.5px] items-start left-[45px] top-0 w-[85.063px]" data-name="Container">
      <Paragraph />
      <Paragraph1 />
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[60.5px] relative shrink-0 w-full" data-name="Container">
      <Container2 />
      <Container3 />
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col h-[94.5px] items-start left-0 pb-px pt-[17px] px-[17px] rounded-[10px] top-0 w-[402.656px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.12)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container4 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="h-[29px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[12.5%]" data-name="Vector">
        <div className="absolute inset-[-3.45%_-3.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
            <path d={svgPaths.pa842c00} id="Vector" stroke="var(--stroke-0, #0056B9)" strokeMiterlimit="10" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[34.38%_31.25%]" data-name="Vector">
        <div className="absolute inset-[-8.28%_-6.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 11">
            <path d={svgPaths.p28f6ba00} id="Vector" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex flex-col h-[29px] items-start left-0 top-[4px] w-[30px]" data-name="Container">
      <Icon3 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[21px] left-0 text-[14px] text-black text-nowrap top-[-1px] whitespace-pre">Leituras concluídas hoje</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[31.5px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[31.5px] left-0 text-[#0056b9] text-[21px] text-nowrap top-[-3px] whitespace-pre">5</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[60.5px] items-start left-[46px] top-0 w-[151.953px]" data-name="Container">
      <Paragraph2 />
      <Paragraph3 />
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[60.5px] relative shrink-0 w-full" data-name="Container">
      <Container6 />
      <Container7 />
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col h-[94.5px] items-start left-[414.66px] pb-px pt-[17px] px-[17px] rounded-[10px] top-0 w-[402.672px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.12)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container8 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="h-[29px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[12.5%]" data-name="Vector">
        <div className="absolute inset-[-5.556%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 25">
            <path d={svgPaths.p24dd6930} id="Vector" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.41667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[29.17%] left-3/4 right-1/4 top-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-12.5%_-1.21px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 13">
            <path d="M1.20833 10.875V1.20833" id="Vector" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.41667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[20.83%_45.83%_29.17%_54.17%]" data-name="Vector">
        <div className="absolute inset-[-8.33%_-1.21px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 17">
            <path d="M1.20833 15.7083V1.20833" id="Vector" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.41667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[58.33%_66.67%_29.17%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-33.33%_-1.21px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 7">
            <path d="M1.20833 4.83333V1.20833" id="Vector" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.41667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 size-[29px] top-[4px]" data-name="Container">
      <Icon4 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[21px] left-0 text-[14px] text-black text-nowrap top-[-1px] whitespace-pre">Taxa de engajamento</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[31.5px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[31.5px] left-0 text-[#0056b9] text-[21px] text-nowrap top-[-3px] whitespace-pre">87%</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[60.5px] items-start left-[45px] top-0 w-[135.234px]" data-name="Container">
      <Paragraph4 />
      <Paragraph5 />
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[60.5px] relative shrink-0 w-full" data-name="Container">
      <Container10 />
      <Container11 />
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col h-[94.5px] items-start left-[829.33px] pb-px pt-[17px] px-[17px] rounded-[10px] top-0 w-[402.656px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.12)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container12 />
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[94.5px] relative shrink-0 w-full" data-name="Container">
      <Container5 />
      <Container9 />
      <Container13 />
    </div>
  );
}

function Section() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[129px] items-start relative shrink-0 w-full" data-name="Section">
      <Heading2 />
      <Container14 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[22.5px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Arimo:Bold',_sans-serif] font-bold leading-[22.5px] left-0 text-[15px] text-black text-nowrap top-[-1px] whitespace-pre">Ações rápidas</p>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p19416e00} id="Vector" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3e059a80} id="Vector_2" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 6H5.33333" id="Vector_3" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 8.66667H5.33333" id="Vector_4" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 11.3333H5.33333" id="Vector_5" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function ProfessionalHome() {
  return (
    <div className="h-[18.563px] relative shrink-0 w-[90.438px]" data-name="ProfessionalHome">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[18.563px] items-start relative w-[90.438px]">
        <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[18.571px] relative shrink-0 text-[13px] text-neutral-950 text-nowrap whitespace-pre">Nova Atividade</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="[grid-area:1_/_1] bg-white box-border content-stretch flex flex-col gap-[8px] items-center justify-center p-px relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon5 />
      <ProfessionalHome />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M5.33333 1.33333V4" id="Vector" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 1.33333V4" id="Vector_2" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3ee34580} id="Vector_3" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 6.66667H14" id="Vector_4" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function ProfessionalHome1() {
  return (
    <div className="h-[18.563px] relative shrink-0 w-[80.563px]" data-name="ProfessionalHome">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[18.563px] items-start relative w-[80.563px]">
        <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[18.571px] relative shrink-0 text-[13px] text-neutral-950 text-nowrap whitespace-pre">Agendar Aula</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="[grid-area:1_/_2] bg-white box-border content-stretch flex flex-col gap-[8px] items-center justify-center p-px relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon6 />
      <ProfessionalHome1 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p90824c0} id="Vector" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M12 11.3333V6" id="Vector_2" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8.66667 11.3333V3.33333" id="Vector_3" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M5.33333 11.3333V9.33333" id="Vector_4" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function ProfessionalHome2() {
  return (
    <div className="h-[18.563px] relative shrink-0 w-[58.813px]" data-name="ProfessionalHome">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[18.563px] items-start relative w-[58.813px]">
        <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[18.571px] relative shrink-0 text-[13px] text-neutral-950 text-nowrap whitespace-pre">Relatórios</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="[grid-area:1_/_3] bg-white box-border content-stretch flex flex-col gap-[8px] items-center justify-center p-px relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon7 />
      <ProfessionalHome2 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M8 4.66667V14" id="Vector" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p8c8fb00} id="Vector_2" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function ProfessionalHome3() {
  return (
    <div className="h-[18.563px] relative shrink-0 w-[58.063px]" data-name="ProfessionalHome">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[18.563px] items-start relative w-[58.063px]">
        <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[18.571px] relative shrink-0 text-[13px] text-neutral-950 text-nowrap whitespace-pre">Biblioteca</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="[grid-area:1_/_4] bg-white box-border content-stretch flex flex-col gap-[8px] items-center justify-center p-px relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon8 />
      <ProfessionalHome3 />
    </div>
  );
}

function Container15() {
  return (
    <div className="gap-[12px] grid grid-cols-[repeat(4,_minmax(0px,_1fr))] grid-rows-[repeat(1,_minmax(0px,_1fr))] h-[76.563px] relative shrink-0 w-full" data-name="Container">
      <Button2 />
      <Button3 />
      <Button4 />
      <Button5 />
    </div>
  );
}

function Section1() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[111.062px] items-start relative shrink-0 w-full" data-name="Section">
      <Heading4 />
      <Container15 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="h-[22.5px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Arimo:Bold',_sans-serif] font-bold leading-[22.5px] left-0 text-[15px] text-black text-nowrap top-[-1px] whitespace-pre">Insights da IA</p>
    </div>
  );
}

function Icon9() {
  return (
    <div className="h-[18px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[29.17%_8.33%_45.83%_66.67%]" data-name="Vector">
        <div className="absolute inset-[-16.667%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
            <path d="M0.75 0.75H5.25V5.25" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[29.17%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-10%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 9">
            <path d={svgPaths.p223a5980} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="bg-[#155dfc] relative rounded-[6px] shrink-0 size-[34px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start pb-0 pt-[8px] px-[8px] relative size-[34px]">
        <Icon9 />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[22.5px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Arimo:Bold',_sans-serif] font-bold leading-[22.5px] left-0 text-[15px] text-black text-nowrap top-[-1px] whitespace-pre">Recomendações personalizadas</p>
    </div>
  );
}

function Icon10() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_47_825)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p245eb100} id="Vector_2" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p18635ff0} id="Vector_3" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_47_825">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="absolute h-[19.5px] left-[24px] top-0 w-[514.219px]" data-name="Text">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[19.5px] left-0 text-[13px] text-[rgba(0,0,0,0.8)] text-nowrap top-[-1px] whitespace-pre">2 alunos apresentam dificuldade com sílabas complexas. Sugerimos atividades de reforço.</p>
    </div>
  );
}

function ListItem() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="List Item">
      <Icon10 />
      <Text />
    </div>
  );
}

function Icon11() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p160f0600} id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p27180a80} id="Vector_2" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute h-[19.5px] left-[24px] top-0 w-[419.625px]" data-name="Text">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[19.5px] left-0 text-[13px] text-[rgba(0,0,0,0.8)] text-nowrap top-[-1px] whitespace-pre">Ana Clara e Beatriz Lima estão prontas para atividades de nível avançado.</p>
    </div>
  );
}

function ListItem1() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="List Item">
      <Icon11 />
      <Text1 />
    </div>
  );
}

function Icon12() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_47_803)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17134c00} id="Vector_2" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_47_803">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute h-[19.5px] left-[24px] top-0 w-[424.141px]" data-name="Text">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[19.5px] left-0 text-[13px] text-[rgba(0,0,0,0.8)] text-nowrap top-[-1px] whitespace-pre">A turma teve 87% de engajamento nas atividades interativas esta semana!</p>
    </div>
  );
}

function ListItem2() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="List Item">
      <Icon12 />
      <Text2 />
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[74.5px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem />
      <ListItem1 />
      <ListItem2 />
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[105px] relative shrink-0 w-[538.219px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[8px] h-[105px] items-start relative w-[538.219px]">
        <Heading3 />
        <List />
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex gap-[12px] h-[105px] items-start relative shrink-0 w-full" data-name="Container">
      <Container16 />
      <Container17 />
    </div>
  );
}

function Container19() {
  return (
    <div className="bg-blue-50 h-[151px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,40,173,0.25)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[151px] items-start pb-px pt-[17px] px-[17px] relative w-full">
          <Container18 />
        </div>
      </div>
    </div>
  );
}

function Section2() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[185.5px] items-start relative shrink-0 w-full" data-name="Section">
      <Heading5 />
      <Container19 />
    </div>
  );
}

function Heading6() {
  return (
    <div className="h-[22.5px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Arimo:Bold',_sans-serif] font-bold leading-[22.5px] left-0 text-[15px] text-black text-nowrap top-[-1px] whitespace-pre">Atividades em andamento</p>
    </div>
  );
}

function Icon13() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p19416e00} id="Vector" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3e059a80} id="Vector_2" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 6H5.33333" id="Vector_3" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 8.66667H5.33333" id="Vector_4" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 11.3333H5.33333" id="Vector_5" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Heading7() {
  return (
    <div className="h-[21px] overflow-clip relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[21px] left-0 text-[14px] text-black text-nowrap top-[-1px] whitespace-pre">Reconhecimento de Sílabas</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[18px] left-0 text-[12px] text-[rgba(0,0,0,0.6)] text-nowrap top-[-1px] whitespace-pre">25/10/2025</p>
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute content-stretch flex flex-col h-[39px] items-start left-[24px] top-0 w-[519.375px]" data-name="Container">
      <Heading7 />
      <Paragraph6 />
    </div>
  );
}

function Container21() {
  return (
    <div className="basis-0 grow h-[39px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[39px] relative w-full">
        <Icon13 />
        <Container20 />
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[30.625px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[19.5px] relative w-[30.625px]">
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[19.5px] left-0 text-[#0056b9] text-[13px] top-[-1px] w-[31px]">14/19</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex h-[39px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container21 />
      <Text3 />
    </div>
  );
}

function Container23() {
  return <div className="bg-[#030213] h-[8px] shrink-0 w-full" data-name="Container" />;
}

function PrimitiveDiv() {
  return (
    <div className="bg-[rgba(3,2,19,0.2)] box-border content-stretch flex flex-col h-[8px] items-start overflow-clip pr-[151.053px] py-0 relative rounded-[3.35544e+07px] shrink-0 w-full" data-name="Primitive.div">
      <Container23 />
    </div>
  );
}

function Container24() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[8px] h-[68px] items-start pb-px pt-0 px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(0,0,0,0.08)] border-solid inset-0 pointer-events-none" />
      <Container22 />
      <PrimitiveDiv />
    </div>
  );
}

function Icon14() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p19416e00} id="Vector" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3e059a80} id="Vector_2" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 6H5.33333" id="Vector_3" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 8.66667H5.33333" id="Vector_4" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 11.3333H5.33333" id="Vector_5" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Heading8() {
  return (
    <div className="h-[21px] overflow-clip relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[21px] left-0 text-[14px] text-black text-nowrap top-[-1px] whitespace-pre">Leitura de Palavras</p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[18px] left-0 text-[12px] text-[rgba(0,0,0,0.6)] text-nowrap top-[-1px] whitespace-pre">24/10/2025</p>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute content-stretch flex flex-col h-[39px] items-start left-[24px] top-0 w-[519.609px]" data-name="Container">
      <Heading8 />
      <Paragraph7 />
    </div>
  );
}

function Container26() {
  return (
    <div className="basis-0 grow h-[39px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[39px] relative w-full">
        <Icon14 />
        <Container25 />
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[30.391px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[19.5px] relative w-[30.391px]">
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[19.5px] left-0 text-[#0056b9] text-[13px] top-[-1px] w-[31px]">19/19</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex h-[39px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container26 />
      <Text4 />
    </div>
  );
}

function PrimitiveDiv1() {
  return <div className="bg-[#030213] h-[8px] rounded-[3.35544e+07px] shrink-0 w-full" data-name="Primitive.div" />;
}

function Container28() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[8px] h-[68px] items-start pb-px pt-0 px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(0,0,0,0.08)] border-solid inset-0 pointer-events-none" />
      <Container27 />
      <PrimitiveDiv1 />
    </div>
  );
}

function Icon15() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p19416e00} id="Vector" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3e059a80} id="Vector_2" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 6H5.33333" id="Vector_3" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 8.66667H5.33333" id="Vector_4" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 11.3333H5.33333" id="Vector_5" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Heading9() {
  return (
    <div className="h-[21px] overflow-clip relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[21px] left-0 text-[14px] text-black text-nowrap top-[-1px] whitespace-pre">Formação de Frases</p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[18px] left-0 text-[12px] text-[rgba(0,0,0,0.6)] text-nowrap top-[-1px] whitespace-pre">23/10/2025</p>
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute content-stretch flex flex-col h-[39px] items-start left-[24px] top-0 w-[519.656px]" data-name="Container">
      <Heading9 />
      <Paragraph8 />
    </div>
  );
}

function Container30() {
  return (
    <div className="basis-0 grow h-[39px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[39px] relative w-full">
        <Icon15 />
        <Container29 />
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[30.344px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[19.5px] relative w-[30.344px]">
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[19.5px] left-0 text-[#0056b9] text-[13px] top-[-1px] w-[31px]">12/19</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex h-[39px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container30 />
      <Text5 />
    </div>
  );
}

function Container32() {
  return <div className="bg-[#030213] h-[8px] shrink-0 w-full" data-name="Container" />;
}

function PrimitiveDiv2() {
  return (
    <div className="bg-[rgba(3,2,19,0.2)] box-border content-stretch flex flex-col h-[8px] items-start overflow-clip pr-[211.474px] py-0 relative rounded-[3.35544e+07px] shrink-0 w-full" data-name="Primitive.div">
      <Container32 />
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[55px] items-start relative shrink-0 w-full" data-name="Container">
      <Container31 />
      <PrimitiveDiv2 />
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[215px] items-start relative shrink-0 w-full" data-name="Container">
      <Container24 />
      <Container28 />
      <Container33 />
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-white h-[36px] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[19.5px] left-[219.61px] text-[13px] text-neutral-950 text-nowrap top-[7.25px] whitespace-pre">Ver todas as atividades</p>
    </div>
  );
}

function Container35() {
  return (
    <div className="bg-white h-[301px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.12)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] h-[301px] items-start pb-px pt-[17px] px-[17px] relative w-full">
          <Container34 />
          <Button6 />
        </div>
      </div>
    </div>
  );
}

function Section3() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex flex-col gap-[12px] items-start relative shrink-0" data-name="Section">
      <Heading6 />
      <Container35 />
    </div>
  );
}

function Heading10() {
  return (
    <div className="h-[22.5px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Arimo:Bold',_sans-serif] font-bold leading-[22.5px] left-0 text-[15px] text-black text-nowrap top-[-1px] whitespace-pre">Leituras recentes</p>
    </div>
  );
}

function Icon16() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[12.5%] left-1/2 right-1/2 top-[29.17%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-0.67px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 11">
            <path d="M0.666667 0.666667V10" id="Vector" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-5.56%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 14">
            <path d={svgPaths.p35cfea80} id="Vector" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="bg-blue-100 relative rounded-[10px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start pb-0 pt-[8px] px-[8px] relative size-[32px]">
        <Icon16 />
      </div>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="h-[21px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[21px] left-0 text-[14px] text-black text-nowrap top-[-1px] whitespace-pre">Ana Clara</p>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[18px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[18px] left-0 text-[12px] text-[rgba(0,0,0,0.6)] text-nowrap top-[-1px] whitespace-pre">O Gato de Botas</p>
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_47_797)" id="Icon">
          <path d="M6 3V6L8 7" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" />
          <path d={svgPaths.p3e7757b0} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" />
        </g>
        <defs>
          <clipPath id="clip0_47_797">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[48.078px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[16.5px] items-start relative w-[48.078px]">
        <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16.5px] relative shrink-0 text-[11px] text-[rgba(0,0,0,0.6)] text-nowrap whitespace-pre">há 15 min</p>
      </div>
    </div>
  );
}

function Icon18() {
  return (
    <div className="absolute left-0 size-[12px] top-[2.25px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_47_793)" id="Icon">
          <path d={svgPaths.p3e7757b0} id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4.5 6L5.5 7L7.5 5" id="Vector_2" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_47_793">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text7() {
  return (
    <div className="basis-0 grow h-[16.5px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16.5px] relative w-full">
        <Icon18 />
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16.5px] left-[16.92px] text-[#00a63e] text-[11px] text-nowrap top-0 whitespace-pre">Concluída</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex gap-[8px] h-[16.5px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon17 />
      <Text6 />
      <Text7 />
    </div>
  );
}

function Container38() {
  return (
    <div className="basis-0 grow h-[59.5px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[59.5px] items-start relative w-full">
        <Paragraph9 />
        <Paragraph10 />
        <Container37 />
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="box-border content-stretch flex gap-[12px] h-[72.5px] items-start pb-px pt-0 px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(0,0,0,0.08)] border-solid inset-0 pointer-events-none" />
      <Container36 />
      <Container38 />
    </div>
  );
}

function Icon19() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[12.5%] left-1/2 right-1/2 top-[29.17%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-0.67px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 11">
            <path d="M0.666667 0.666667V10" id="Vector" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-5.56%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 14">
            <path d={svgPaths.p35cfea80} id="Vector" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="bg-blue-100 relative rounded-[10px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start pb-0 pt-[8px] px-[8px] relative size-[32px]">
        <Icon19 />
      </div>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="h-[21px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[21px] left-0 text-[14px] text-black text-nowrap top-[-1px] whitespace-pre">João Augusto</p>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="h-[18px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[18px] left-0 text-[12px] text-[rgba(0,0,0,0.6)] text-nowrap top-[-1px] whitespace-pre">Chapeuzinho Vermelho</p>
    </div>
  );
}

function Icon20() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_47_797)" id="Icon">
          <path d="M6 3V6L8 7" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" />
          <path d={svgPaths.p3e7757b0} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" />
        </g>
        <defs>
          <clipPath id="clip0_47_797">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[48.078px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[16.5px] items-start relative w-[48.078px]">
        <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16.5px] relative shrink-0 text-[11px] text-[rgba(0,0,0,0.6)] text-nowrap whitespace-pre">há 32 min</p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex gap-[8px] h-[16.5px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon20 />
      <Text8 />
    </div>
  );
}

function Container42() {
  return (
    <div className="basis-0 grow h-[59.5px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[59.5px] items-start relative w-full">
        <Paragraph11 />
        <Paragraph12 />
        <Container41 />
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="box-border content-stretch flex gap-[12px] h-[72.5px] items-start pb-px pt-0 px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(0,0,0,0.08)] border-solid inset-0 pointer-events-none" />
      <Container40 />
      <Container42 />
    </div>
  );
}

function Icon21() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[12.5%] left-1/2 right-1/2 top-[29.17%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-0.67px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 11">
            <path d="M0.666667 0.666667V10" id="Vector" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-5.56%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 14">
            <path d={svgPaths.p35cfea80} id="Vector" stroke="var(--stroke-0, #0056B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="bg-blue-100 relative rounded-[10px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start pb-0 pt-[8px] px-[8px] relative size-[32px]">
        <Icon21 />
      </div>
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="h-[21px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[21px] left-0 text-[14px] text-black text-nowrap top-[-1px] whitespace-pre">Beatriz Lima</p>
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="h-[18px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[18px] left-0 text-[12px] text-[rgba(0,0,0,0.6)] text-nowrap top-[-1px] whitespace-pre">Os Três Porquinhos</p>
    </div>
  );
}

function Icon22() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_47_797)" id="Icon">
          <path d="M6 3V6L8 7" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" />
          <path d={svgPaths.p3e7757b0} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4" />
        </g>
        <defs>
          <clipPath id="clip0_47_797">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[45.875px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[16.5px] items-start relative w-[45.875px]">
        <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16.5px] relative shrink-0 text-[11px] text-[rgba(0,0,0,0.6)] text-nowrap whitespace-pre">há 1 hora</p>
      </div>
    </div>
  );
}

function Icon23() {
  return (
    <div className="absolute left-0 size-[12px] top-[2.25px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_47_793)" id="Icon">
          <path d={svgPaths.p3e7757b0} id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4.5 6L5.5 7L7.5 5" id="Vector_2" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_47_793">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text10() {
  return (
    <div className="basis-0 grow h-[16.5px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16.5px] relative w-full">
        <Icon23 />
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16.5px] left-[16.13px] text-[#00a63e] text-[11px] text-nowrap top-0 whitespace-pre">Concluída</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex gap-[8px] h-[16.5px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon22 />
      <Text9 />
      <Text10 />
    </div>
  );
}

function Container46() {
  return (
    <div className="basis-0 grow h-[59.5px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[59.5px] items-start relative w-full">
        <Paragraph13 />
        <Paragraph14 />
        <Container45 />
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex gap-[12px] h-[59.5px] items-start relative shrink-0 w-full" data-name="Container">
      <Container44 />
      <Container46 />
    </div>
  );
}

function Container48() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[228.5px] items-start relative shrink-0 w-full" data-name="Container">
      <Container39 />
      <Container43 />
      <Container47 />
    </div>
  );
}

function Container49() {
  return (
    <div className="bg-white h-[262.5px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.12)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[262.5px] items-start pb-px pt-[17px] px-[17px] relative w-full">
          <Container48 />
        </div>
      </div>
    </div>
  );
}

function Section4() {
  return (
    <div className="[grid-area:1_/_2] content-stretch flex flex-col gap-[12px] items-start relative shrink-0" data-name="Section">
      <Heading10 />
      <Container49 />
    </div>
  );
}

function Container50() {
  return (
    <div className="gap-[16px] grid grid-cols-[repeat(2,_minmax(0px,_1fr))] grid-rows-[repeat(1,_minmax(0px,_1fr))] h-[335.5px] relative shrink-0 w-full" data-name="Container">
      <Section3 />
      <Section4 />
    </div>
  );
}

function Icon24() {
  return (
    <div className="absolute left-0 size-[20px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_47_788)" id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #F5A623)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 6.66667V10" id="Vector_2" stroke="var(--stroke-0, #F5A623)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 13.3333H10.0083" id="Vector_3" stroke="var(--stroke-0, #F5A623)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_47_788">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Heading11() {
  return (
    <div className="h-[22.5px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Arimo:Bold',_sans-serif] font-bold leading-[22.5px] left-0 text-[#7b3306] text-[15px] text-nowrap top-[-1px] whitespace-pre">Alunos que precisam de atenção</p>
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[19.5px] left-0 text-[#973c00] text-[13px] top-[-0.5px] w-[274px]">2 alunos estão com progresso abaixo de 50%</p>
    </div>
  );
}

function Container51() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[46px] items-start left-[32px] top-0 w-[259.453px]" data-name="Container">
      <Heading11 />
      <Paragraph15 />
    </div>
  );
}

function Container52() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Container">
      <Icon24 />
      <Container51 />
    </div>
  );
}

function Text11() {
  return (
    <div className="absolute h-[21px] left-[12px] top-[12px] w-[26.828px]" data-name="Text">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[21px] left-0 text-[14px] text-black text-nowrap top-[-1px] whitespace-pre">Júlia</p>
    </div>
  );
}

function Text12() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[24.656px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[19.5px] relative w-[24.656px]">
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[19.5px] left-[-3.34px] text-[#bb4d00] text-[13px] top-[-0.75px] w-[28px]">45%</p>
      </div>
    </div>
  );
}

function Container53() {
  return <div className="bg-[#fe9a00] h-[8px] shrink-0 w-[74px]" data-name="Container" />;
}

function Container54() {
  return (
    <div className="basis-0 bg-gray-200 grow h-[8px] min-h-px min-w-px relative rounded-[3.35544e+07px] shrink-0" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[8px] items-start pl-0 pr-[35.203px] py-0 relative w-full">
          <Container53 />
        </div>
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[20px] items-center left-[294px] top-[16px] w-[205px]" data-name="Container">
      <Text12 />
      <Container54 />
    </div>
  );
}

function Container56() {
  return (
    <div className="absolute bg-white h-[45px] left-0 rounded-[10px] top-0 w-[587px]" data-name="Container">
      <Text11 />
      <Container55 />
    </div>
  );
}

function Text13() {
  return (
    <div className="h-[21px] relative shrink-0 w-[81.172px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[81.172px]">
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[21px] left-0 text-[14px] text-black text-nowrap top-[-1px] whitespace-pre">Pedro Santos</p>
      </div>
    </div>
  );
}

function Text14() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[24.656px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[19.5px] relative w-[24.656px]">
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[19.5px] left-[-3.34px] text-[#bb4d00] text-[13px] top-[0.25px] w-[31px]">38%</p>
      </div>
    </div>
  );
}

function Container57() {
  return <div className="bg-[#fe9a00] h-[8px] shrink-0 w-[67px]" data-name="Container" />;
}

function Container58() {
  return (
    <div className="basis-0 bg-gray-200 grow h-[8px] min-h-px min-w-px relative rounded-[3.35544e+07px] shrink-0" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[8px] items-start pl-0 pr-[39.688px] py-0 relative w-full">
          <Container57 />
        </div>
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="h-[19px] relative shrink-0 w-[205px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[19px] items-center relative w-[205px]">
        <Text14 />
        <Container58 />
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div className="absolute bg-white box-border content-stretch flex h-[45px] items-center justify-between left-[599px] px-[12px] py-0 rounded-[10px] top-0 w-[587px]" data-name="Container">
      <Text13 />
      <Container59 />
    </div>
  );
}

function Container61() {
  return (
    <div className="h-[98px] relative shrink-0 w-full" data-name="Container">
      <Container56 />
      <Container60 />
    </div>
  );
}

function Section5() {
  return (
    <div className="bg-[#fef6e9] h-[136px] relative rounded-[10px] shrink-0 w-full" data-name="Section">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[12px] h-[136px] items-start pb-px pt-[17px] px-[17px] relative w-full">
          <Container52 />
          <Container61 />
        </div>
      </div>
    </div>
  );
}

function Heading12() {
  return (
    <div className="h-[22.5px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Arimo:Bold',_sans-serif] font-bold leading-[22.5px] left-0 text-[15px] text-black text-nowrap top-[-1px] whitespace-pre">Meus alunos</p>
    </div>
  );
}

function TextInput() {
  return (
    <div className="absolute bg-white h-[41px] left-0 rounded-[25px] top-[0.44px] w-[528px]" data-name="Text Input">
      <div className="box-border content-stretch flex h-[41px] items-center overflow-clip pl-[44px] pr-[16px] py-0 relative rounded-[inherit] w-[528px]">
        <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[13px] text-[rgba(0,0,0,0.6)] text-nowrap whitespace-pre">Buscar por nome do aluno</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[25px]" />
    </div>
  );
}

function Icon25() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[69.42%_12.5%_12.5%_69.42%]" data-name="Vector">
        <div className="absolute inset-[-23.041%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
            <path d="M4.45 4.45L0.833333 0.833333" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_20.83%_20.83%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
            <path d={svgPaths.p32110270} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container62() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[14px] size-[20px] top-[10.5px]" data-name="Container">
      <Icon25 />
    </div>
  );
}

function Container63() {
  return (
    <div className="h-[41px] relative shrink-0 w-full" data-name="Container">
      <TextInput />
      <Container62 />
    </div>
  );
}

function Icon26() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p67f12c8} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2c19cb00} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container64() {
  return (
    <div className="relative rounded-[3.35544e+07px] shrink-0 size-[43px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-0 pointer-events-none rounded-[3.35544e+07px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center p-[2px] relative size-[43px]">
        <Icon26 />
      </div>
    </div>
  );
}

function Paragraph16() {
  return (
    <div className="h-[21px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[21px] left-0 text-[14px] text-black text-nowrap top-[-1px] whitespace-pre">João Augusto</p>
    </div>
  );
}

function Paragraph17() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[18px] left-0 text-[12px] text-black top-[-0.56px] w-[48px]">12 anos</p>
    </div>
  );
}

function Container65() {
  return (
    <div className="basis-0 grow h-[39px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[39px] items-start relative w-full">
        <Paragraph16 />
        <Paragraph17 />
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-[#3184e3] h-[31px] relative rounded-[10px] shrink-0 w-[97.984px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[31px] items-center justify-center px-[16px] py-[8px] relative w-[97.984px]">
        <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[19.5px] relative shrink-0 text-[13px] text-nowrap text-white whitespace-pre">Ver leituras</p>
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div className="[grid-area:1_/_1] bg-white relative rounded-[10px] shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.12)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] items-center px-[17px] py-px relative size-full">
          <Container64 />
          <Container65 />
          <Button7 />
        </div>
      </div>
    </div>
  );
}

function Icon27() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p67f12c8} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2c19cb00} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container67() {
  return (
    <div className="relative rounded-[3.35544e+07px] shrink-0 size-[43px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-0 pointer-events-none rounded-[3.35544e+07px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center p-[2px] relative size-[43px]">
        <Icon27 />
      </div>
    </div>
  );
}

function Paragraph18() {
  return (
    <div className="h-[21px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[21px] left-0 text-[14px] text-black text-nowrap top-[-1px] whitespace-pre">Ana Clara</p>
    </div>
  );
}

function Paragraph19() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[18px] left-0 text-[12px] text-black top-[-1px] w-[42px]">11 anos</p>
    </div>
  );
}

function Container68() {
  return (
    <div className="basis-0 grow h-[39px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[39px] items-start relative w-full">
        <Paragraph18 />
        <Paragraph19 />
      </div>
    </div>
  );
}

function Button8() {
  return (
    <div className="bg-[#3184e3] h-[31px] relative rounded-[10px] shrink-0 w-[97.984px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[31px] items-center justify-center px-[16px] py-[8px] relative w-[97.984px]">
        <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[19.5px] relative shrink-0 text-[13px] text-nowrap text-white whitespace-pre">Ver leituras</p>
      </div>
    </div>
  );
}

function Container69() {
  return (
    <div className="[grid-area:1_/_2] bg-white relative rounded-[10px] shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.12)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] items-center px-[17px] py-px relative size-full">
          <Container67 />
          <Container68 />
          <Button8 />
        </div>
      </div>
    </div>
  );
}

function Icon28() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p67f12c8} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2c19cb00} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container70() {
  return (
    <div className="relative rounded-[3.35544e+07px] shrink-0 size-[43px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-0 pointer-events-none rounded-[3.35544e+07px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center p-[2px] relative size-[43px]">
        <Icon28 />
      </div>
    </div>
  );
}

function Paragraph20() {
  return (
    <div className="h-[21px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[21px] left-0 text-[14px] text-black text-nowrap top-[-1px] whitespace-pre">Júlia</p>
    </div>
  );
}

function Paragraph21() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[18px] left-0 text-[12px] text-black top-[-1px] w-[42px]">11 anos</p>
    </div>
  );
}

function Container71() {
  return (
    <div className="basis-0 grow h-[39px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[39px] items-start relative w-full">
        <Paragraph20 />
        <Paragraph21 />
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div className="bg-[#3184e3] h-[31px] relative rounded-[10px] shrink-0 w-[97.984px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[31px] items-center justify-center px-[16px] py-[8px] relative w-[97.984px]">
        <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[19.5px] relative shrink-0 text-[13px] text-nowrap text-white whitespace-pre">Ver leituras</p>
      </div>
    </div>
  );
}

function Container72() {
  return (
    <div className="[grid-area:2_/_1] bg-white relative rounded-[10px] shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.12)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] items-center px-[17px] py-px relative size-full">
          <Container70 />
          <Container71 />
          <Button9 />
        </div>
      </div>
    </div>
  );
}

function Icon29() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p67f12c8} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2c19cb00} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container73() {
  return (
    <div className="relative rounded-[3.35544e+07px] shrink-0 size-[43px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-0 pointer-events-none rounded-[3.35544e+07px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center p-[2px] relative size-[43px]">
        <Icon29 />
      </div>
    </div>
  );
}

function Paragraph22() {
  return (
    <div className="h-[21px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[21px] left-0 text-[14px] text-black text-nowrap top-[-1px] whitespace-pre">Manuela Oliveira</p>
    </div>
  );
}

function Paragraph23() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[18px] left-0 text-[12px] text-black top-[-1px] w-[42px]">10 anos</p>
    </div>
  );
}

function Container74() {
  return (
    <div className="basis-0 grow h-[39px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[39px] items-start relative w-full">
        <Paragraph22 />
        <Paragraph23 />
      </div>
    </div>
  );
}

function Button10() {
  return (
    <div className="bg-[#3184e3] h-[31px] relative rounded-[10px] shrink-0 w-[97.984px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[31px] items-center justify-center px-[16px] py-[8px] relative w-[97.984px]">
        <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[19.5px] relative shrink-0 text-[13px] text-nowrap text-white whitespace-pre">Ver leituras</p>
      </div>
    </div>
  );
}

function Container75() {
  return (
    <div className="[grid-area:2_/_2] bg-white relative rounded-[10px] shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.12)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] items-center px-[17px] py-px relative size-full">
          <Container73 />
          <Container74 />
          <Button10 />
        </div>
      </div>
    </div>
  );
}

function Icon30() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p67f12c8} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2c19cb00} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container76() {
  return (
    <div className="relative rounded-[3.35544e+07px] shrink-0 size-[43px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-0 pointer-events-none rounded-[3.35544e+07px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center p-[2px] relative size-[43px]">
        <Icon30 />
      </div>
    </div>
  );
}

function Paragraph24() {
  return (
    <div className="h-[21px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[21px] left-0 text-[14px] text-black text-nowrap top-[-1px] whitespace-pre">Pedro Santos</p>
    </div>
  );
}

function Paragraph25() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[18px] left-0 text-[12px] text-black top-[-0.56px] w-[51px]">12 anos</p>
    </div>
  );
}

function Container77() {
  return (
    <div className="basis-0 grow h-[39px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[39px] items-start relative w-full">
        <Paragraph24 />
        <Paragraph25 />
      </div>
    </div>
  );
}

function Button11() {
  return (
    <div className="bg-[#3184e3] h-[31px] relative rounded-[10px] shrink-0 w-[97.984px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[31px] items-center justify-center px-[16px] py-[8px] relative w-[97.984px]">
        <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[19.5px] relative shrink-0 text-[13px] text-nowrap text-white whitespace-pre">Ver leituras</p>
      </div>
    </div>
  );
}

function Container78() {
  return (
    <div className="[grid-area:3_/_1] bg-white relative rounded-[10px] shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.12)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] items-center px-[17px] py-px relative size-full">
          <Container76 />
          <Container77 />
          <Button11 />
        </div>
      </div>
    </div>
  );
}

function Icon31() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p67f12c8} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2c19cb00} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container79() {
  return (
    <div className="relative rounded-[3.35544e+07px] shrink-0 size-[43px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-0 pointer-events-none rounded-[3.35544e+07px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center p-[2px] relative size-[43px]">
        <Icon31 />
      </div>
    </div>
  );
}

function Paragraph26() {
  return (
    <div className="h-[21px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[21px] left-0 text-[14px] text-black text-nowrap top-[-1px] whitespace-pre">Beatriz Lima</p>
    </div>
  );
}

function Paragraph27() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[18px] left-0 text-[12px] text-black top-[-1px] w-[42px]">11 anos</p>
    </div>
  );
}

function Container80() {
  return (
    <div className="basis-0 grow h-[39px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[39px] items-start relative w-full">
        <Paragraph26 />
        <Paragraph27 />
      </div>
    </div>
  );
}

function Button12() {
  return (
    <div className="bg-[#3184e3] h-[31px] relative rounded-[10px] shrink-0 w-[97.984px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[31px] items-center justify-center px-[16px] py-[8px] relative w-[97.984px]">
        <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[19.5px] relative shrink-0 text-[13px] text-nowrap text-white whitespace-pre">Ver leituras</p>
      </div>
    </div>
  );
}

function Container81() {
  return (
    <div className="[grid-area:3_/_2] bg-white relative rounded-[10px] shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.12)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] items-center px-[17px] py-px relative size-full">
          <Container79 />
          <Container80 />
          <Button12 />
        </div>
      </div>
    </div>
  );
}

function Container82() {
  return (
    <div className="gap-[16px] grid grid-cols-[repeat(2,_minmax(0px,_1fr))] grid-rows-[repeat(3,_minmax(0px,_1fr))] h-[263px] relative shrink-0 w-full" data-name="Container">
      <Container66 />
      <Container69 />
      <Container72 />
      <Container75 />
      <Container78 />
      <Container81 />
    </div>
  );
}

function Section6() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[354.5px] items-start relative shrink-0 w-full" data-name="Section">
      <Heading12 />
      <Container63 />
      <Container82 />
    </div>
  );
}

function MainContent() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[24px] h-[1524.56px] items-start left-[137px] pb-0 pt-[24px] px-[24px] top-[52px] w-[1280px]" data-name="Main Content">
      <Heading1 />
      <Section />
      <Section1 />
      <Section2 />
      <Container50 />
      <Section5 />
      <Section6 />
    </div>
  );
}

function ProfessionalHome4() {
  return (
    <div className="bg-[#f0f0f0] h-[1576.56px] relative shrink-0 w-full" data-name="ProfessionalHome">
      <Header />
      <MainContent />
    </div>
  );
}

export default function TelaDeAutenticacaoLetrarIa() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative size-full" data-name="Tela de Autenticação Letrar IA">
      <ProfessionalHome4 />
    </div>
  );
}