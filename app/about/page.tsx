import type { Metadata } from "next";
import { PageShell } from "@/components/site-shell";
import { CTASection, HeroSection, IconBox, SectionTitle, icons } from "@/components/marketing";

export const metadata: Metadata = {
  title: "Về chúng tôi",
  alternates: { canonical: "/about" },
  description: "Moneyfest giúp bạn hiểu luật chơi để làm chủ cuộc đời.",
};

const coreValues = [
  ["Trí tuệ", "Tìm bản chất, không chỉ nhìn bề mặt.", icons.lightbulb],
  ["Chính trực", "Đặt lợi ích khách hàng trước hoa hồng.", icons.shield],
  ["Sáng tỏ", "Biến điều phức tạp thành quyết định dễ hiểu.", icons.compass],
  ["Trách nhiệm", "Không FOMO, không hô hào, không cam kết lợi nhuận.", icons.scale],
  ["Tư duy dài hạn", "Ưu tiên sức khỏe tài chính bền vững.", icons.target],
] as const;

export default function AboutPage() {
  return (
    <PageShell>
      <HeroSection
        eyebrow="Về chúng tôi"
        title={<>Hiểu luật chơi để <span className="text-[var(--mf-gold)]">làm chủ cuộc đời.</span></>}
        description="Moneyfest là hệ sinh thái tri thức, tư vấn và kết nối giải pháp tài chính, giúp cá nhân, gia đình và doanh nghiệp hiểu rõ lựa chọn, so sánh nhiều phương án và ra quyết định phù hợp với mục tiêu dài hạn."
        image="/images/moneyfest/about/about-moneyfest.jpg"
        primary={{ href: "#ecosystem", label: "Khám phá hệ sinh thái" }}
        secondary={{ href: "#values", label: "Xem giá trị cốt lõi" }}
      />

      <section className="mf-cream-section py-14">
        <div className="mf-container grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <h2 className="mf-display text-[clamp(2.2rem,4vw,3.5rem)] font-bold text-[var(--mf-midnight)]">Moneyfest là ai?</h2>
            <p className="mt-4 leading-8 text-[var(--mf-slate)]">Chúng tôi tin rằng tài chính không chỉ là con số, mà là cách bạn lựa chọn sống và kiến tạo cuộc đời mình.</p>
            <p className="mt-4 leading-8 text-[var(--mf-slate)]">Moneyfest được thành lập với sứ mệnh giúp bạn hiểu rõ luật chơi tài chính của riêng mình, chủ động đề chọn lựa, đánh giá và đưa ra các quyết định phù hợp với mục tiêu dài hạn.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <IconBox icon={<icons.dollar />} title="Hiểu tiền">Nắm rõ dòng tiền, công cụ và cơ chế vận hành của thị trường.</IconBox>
            <IconBox icon={<icons.users />} title="Hiểu bản thân">Hiểu giá trị, mục tiêu và năng lực để ra quyết định phù hợp.</IconBox>
            <IconBox icon={<icons.globe />} title="Hiểu thế giới">Nhìn bức tranh toàn cảnh để lựa chọn thông minh.</IconBox>
          </div>
        </div>
      </section>

      <section className="mf-dark-section py-12">
        <div className="mf-container grid gap-6 md:grid-cols-2">
          <div className="mf-card-dark p-8"><h3 className="mf-display text-4xl font-bold text-[var(--mf-gold)]">Tầm nhìn</h3><p className="mt-3 text-[rgba(244,240,232,0.76)]">Xây dựng một thế hệ tự chủ về tư duy, tài chính và cuộc sống nhờ hiểu đúng luật chơi của thế giới.</p></div>
          <div className="mf-card-dark p-8"><h3 className="mf-display text-4xl font-bold text-[var(--mf-gold)]">Sứ mệnh</h3><p className="mt-3 text-[rgba(244,240,232,0.76)]">Giúp khách hàng hiểu đúng trước khi ra quyết định tài chính, kết nối nhu cầu thật với giải pháp phù hợp và minh bạch.</p></div>
        </div>
      </section>

      <section id="values" className="mf-cream-section py-14">
        <div className="mf-container">
          <SectionTitle title="Giá trị cốt lõi" />
          <div className="mt-8 grid gap-5 md:grid-cols-5">
            {coreValues.map(([title, desc, Icon]) => <IconBox key={title} icon={<Icon />} title={title}>{desc}</IconBox>)}
          </div>
        </div>
      </section>

      <section className="mf-dark-section py-14">
        <div className="mf-container grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="mf-eyebrow">Triết lý thương hiệu</p>
            <blockquote className="mf-display mt-4 text-[clamp(2rem,4vw,3.7rem)] italic leading-tight text-[var(--mf-champagne)]">“Tự do không đến từ việc có nhiều tiền hơn. Tự do đến từ việc hiểu rõ cuộc chơi mình đang tham gia.”</blockquote>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {["Biến sự phức tạp thành sáng tỏ", "Biến sáng tỏ thành quyết định", "Biến quyết định đúng thành cuộc đời chủ động hơn"].map((item, index) => <div key={item} className="mf-card-dark p-6"><p className="mf-display text-3xl text-[var(--mf-gold)]">0{index + 1}</p><h3 className="mt-4 font-bold">{item}</h3></div>)}
          </div>
        </div>
      </section>

      <section id="ecosystem" className="mf-cream-section py-14">
        <div className="mf-container">
          <SectionTitle title="Hệ sinh thái Moneyfest" />
          <div className="mt-8 grid gap-4 md:grid-cols-7">
            {["Insights", "Community", "Advisory", "Partnership", "Academy", "Mastery", "Summit"].map((item) => <div key={item} className="mf-card-dark p-5 text-center font-bold">{item}</div>)}
          </div>
        </div>
      </section>

      <CTASection title="Sẵn sàng đồng hành cùng Moneyfest?" description="Bắt đầu từ sự sáng tỏ — trước khi đến với các quyết định lớn về tiền bạc, tài sản và tương lai." />
    </PageShell>
  );
}

