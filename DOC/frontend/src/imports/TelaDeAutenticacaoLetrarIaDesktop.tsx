import svgPaths from "./svg-luvo32n1y5";
import imgAccountMale from "figma:asset/6fc471d91da85fe4fda398eb3bf23ec06bafe9a5.png";
import imgImageWithFallback from "figma:asset/188c677e9a5f499b73df2e014e7a30d6c55091cb.png";

function Icon() {
  return (
    <div className="absolute left-0 size-[40px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="Icon">
          <path d="M20 11.6667V35" id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
          <path d={svgPaths.p25dbd80} id="Vector_2" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[28px] size-[16px] top-[-4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_10_134)" id="Icon">
          <path d={svgPaths.p2b60d00} id="Vector" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M13.3333 1.33333V4" id="Vector_2" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M14.6667 2.66667H12" id="Vector_3" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p22966600} id="Vector_4" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_10_134">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function AuthCard() {
  return (
    <div className="absolute left-[204px] size-[40px] top-[24px]" data-name="AuthCard">
      <Icon />
      <Icon1 />
    </div>
  );
}

function CardTitle() {
  return (
    <div className="absolute h-[36px] left-[24px] top-[78px] w-[400px]" data-name="CardTitle">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[36px] left-[200.17px] text-[30px] text-center text-neutral-950 text-nowrap top-[-3px] translate-x-[-50%] whitespace-pre">Letrar IA</p>
    </div>
  );
}

function CardDescription() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[141px] w-[400px]" data-name="CardDescription">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[24px] left-[200px] text-[#717182] text-[16px] text-center text-nowrap top-[-6px] translate-x-[-50%] whitespace-pre">Sua plataforma inteligente de alfabetização</p>
    </div>
  );
}

function CardHeader() {
  return (
    <div className="absolute h-[188px] left-0 top-0 w-[448px]" data-name="CardHeader">
      <AuthCard />
      <CardTitle />
      <CardDescription />
    </div>
  );
}

function PrimitiveLabel() {
  return (
    <div className="content-stretch flex gap-[8px] h-[14px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[14px] relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">Username</p>
    </div>
  );
}

function Input() {
  return (
    <div className="absolute bg-[#f3f3f5] h-[36px] left-0 rounded-[8px] top-0 w-[400px]" data-name="Input">
      <div className="box-border content-stretch flex h-[36px] items-center overflow-clip pl-[40px] pr-[12px] py-[4px] relative rounded-[inherit] w-[400px]">
        <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#717182] text-[14px] text-nowrap whitespace-pre">username</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <Input />
      <div className="absolute inset-[22.22%_92.25%_22.22%_2.75%]" data-name="Account Male">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgAccountMale} />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[58px] items-start relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel />
      <Container />
    </div>
  );
}

function PrimitiveLabel1() {
  return (
    <div className="content-stretch flex gap-[8px] h-[14px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[14px] relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">Senha</p>
    </div>
  );
}

function Input1() {
  return (
    <div className="absolute bg-[#f3f3f5] h-[36px] left-0 rounded-[8px] top-0 w-[400px]" data-name="Input">
      <div className="box-border content-stretch flex h-[36px] items-center overflow-clip pl-[40px] pr-[12px] py-[4px] relative rounded-[inherit] w-[400px]">
        <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#717182] text-[14px] text-nowrap whitespace-pre">••••••••</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[12.75px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <Input1 />
      <Icon2 />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[58px] items-start relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel1 />
      <Container2 />
    </div>
  );
}

function Checkbox() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[16px]" data-name="Checkbox">
      <div aria-hidden="true" className="absolute border-[0.5px] border-black border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[16px]" />
    </div>
  );
}

function Text() {
  return (
    <div className="basis-0 grow h-[24px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-full">
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[24px] left-0 text-[#4a5565] text-[16px] text-nowrap top-[-1px] whitespace-pre">Lembrar de mim</p>
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="relative shrink-0 w-[109.516px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] items-center relative w-[109.516px]">
        <Checkbox />
        <Text />
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="h-[24px] relative shrink-0" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[24px] items-center relative">
        <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] relative shrink-0 text-[#155dfc] text-[14px] w-[158px]">Esqueceu a senha?</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[24px] items-center justify-between px-[10px] py-0 relative w-full">
          <Label />
          <Link />
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#030213] h-[42px] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[42px] items-center justify-center px-[16px] py-[8px] relative w-full">
          <p className="basis-0 font-['Arimo:Bold',_sans-serif] font-bold grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[14px] text-center text-white">Entrar</p>
        </div>
      </div>
    </div>
  );
}

function AuthCard1() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[400px]" data-name="AuthCard">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[16px] h-full items-start relative w-[400px]">
        <Container1 />
        <Container3 />
        <Container4 />
        <Button />
      </div>
    </div>
  );
}

function PrimitiveDiv() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] h-[292px] items-start left-[24px] top-[188px] w-[400px]" data-name="Primitive.div">
      <AuthCard1 />
    </div>
  );
}

function Card() {
  return (
    <div className="bg-white h-[504px] relative rounded-[14px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] shrink-0 w-full" data-name="Card">
      <CardHeader />
      <PrimitiveDiv />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="basis-0 font-['Arimo:Regular',_sans-serif] font-normal grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[#6a7282] text-[14px] text-center">© 2025 Letrar IA. Todos os direitos reservados.</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute bg-[#fdfdfd] content-stretch flex flex-col gap-[32px] items-start left-[938px] top-[193px] w-[448px]" data-name="Container">
      <Card />
      <Paragraph />
    </div>
  );
}

function ImageWithFallback() {
  return (
    <div className="absolute h-[942px] left-0 opacity-30 top-0 w-[775.5px]" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageWithFallback} />
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[96px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[48px] left-[224.39px] text-[48px] text-center text-white top-[-5px] translate-x-[-50%] w-[440px]">Transforme a alfabetização com IA</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[84px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Bold',_sans-serif] font-bold leading-[28px] left-[226.5px] text-[20px] text-blue-100 text-center top-[42px] translate-x-[-50%] w-[463px]">Ferramentas inteligentes para acelerar o processo de aprendizagem e tornar a educação mais eficiente e personalizada.</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] h-[340px] items-start left-[164px] top-[301px] w-[448px]" data-name="Container">
      <Heading />
      <Paragraph1 />
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute h-[942px] left-0 overflow-clip top-0 w-[775.5px]" data-name="Container">
      <ImageWithFallback />
      <Container6 />
    </div>
  );
}

export default function TelaDeAutenticacaoLetrarIaDesktop() {
  return (
    <div className="bg-white relative size-full" data-name="Tela de Autenticação Letrar IA - Desktop">
      <Container5 />
      <Container7 />
    </div>
  );
}