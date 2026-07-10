import { PageShell } from "@/components/site-shell";
import { CTASection, GoldButton, HeroSection, IconBox, SectionTitle, Timeline, icons } from "@/components/marketing";
import { products } from "@/data/products";

const problems = [
  ["Thu nhập ổn định nhưng tài sản mơ hồ", "Đi làm nhiều năm nhưng chưa rõ mình đã tích lũy được gì và sẽ đạt tự do tài chính khi nào."],
  ["Không biết nên ưu tiên điều gì trước", "Nên trả nợ, tiết kiệm, mua bảo hiểm, đầu tư hay mua nhà trước? Làm sao để không hối tiếc?"],
  ["Nhiều thông tin nhưng rối hơn", "Nghe ai cũng có lý. Nhưng quyết định sai thì mình phải chịu."],
  ["Cần một kế hoạch phù hợp với mình", "Không phải công thức chung. Bạn cần một lộ trình phù hợp với thu nhập, mục tiêu và hoàn cảnh."],
];

export default function Home() {
  return (
    <PageShell>
      <HeroSection
        eyebrow="Moneyfest"
        title={<>Hiểu rõ tiền của bạn đang đi về đâu.</>}
        description="Moneyfest giúp bạn lập bản đồ dòng tiền, tài sản, rủi ro và mục tiêu tài chính — trước khi ra quyết định về tiết kiệm, nợ, bảo hiểm, đầu tư hay mua nhà."
        image="/images/moneyfest/hero/homepage.jpg"
        primary={{ href: "/contact", label: "Đặt lịch soi dòng tiền 1:1" }}
        secondary={{ href: "/tools", label: "Làm quiz sức khỏe tài chính" }}
        badges={["Không FOMO", "Không phím hàng", "Không cam kết lợi nhuận", "Bắt đầu từ hoàn cảnh của bạn"]}
      />

      <section className="mf-cream-section py-14">
        <div className="mf-container">
          <SectionTitle title="Bạn có đang gặp những vấn đề này?" />
          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {problems.map(([title, desc]) => <IconBox key={title} icon={<icons.lightbulb />} title={title}>{desc}</IconBox>)}
          </div>
        </div>
      </section>

      <section className="mf-dark-section py-16">
        <div className="mf-container grid items-center gap-8 lg:grid-cols-[1fr_0.72fr]">
          <div>
            <p className="mf-eyebrow">Dịch vụ chủ lực</p>
            <h2 className="mf-display mt-3 text-[clamp(2.4rem,4vw,4rem)] font-bold leading-tight">Money Map 1:1 – Lập bản đồ tài chính cá nhân</h2>
            <p className="mt-4 max-w-3xl text-[rgba(244,240,232,0.75)]">Một buổi làm việc riêng giúp bạn nhìn rõ bức tranh tài chính và xác định 3–5 bước ưu tiên trong 90 ngày tới.</p>
            <ul className="mt-6 grid gap-2 text-sm text-[rgba(244,240,232,0.82)]">
              {["Bản đồ dòng tiền: thu nhập – chi tiêu – tiết kiệm – nợ", "Chẩn đoán sức khỏe tài chính: điểm mạnh, điểm yếu, rủi ro", "Thứ tự ưu tiên 90 ngày: việc nào làm trước, việc nào chưa nên làm", "Gợi ý giải pháp và công cụ phù hợp với bạn"].map((item) => (
                <li key={item} className="flex items-start gap-2"><icons.check className="mt-1 text-[var(--mf-gold)]" size={16} />{item}</li>
              ))}
            </ul>
          </div>
          <div className="mf-card-dark p-6">
            <p className="mf-display text-4xl font-bold text-[var(--mf-gold)]">60 – 90 phút</p>
            <p className="mt-3 text-sm text-[rgba(244,240,232,0.75)]">Online 1:1 với chuyên gia, phù hợp người đi làm và gia đình trẻ muốn tối ưu tài chính.</p>
            <p className="mt-5 text-2xl font-bold">Từ 1.500.000đ / buổi</p>
            <div className="mt-6"><GoldButton href="/contact">Đặt lịch ngay</GoldButton></div>
          </div>
        </div>
      </section>

      <section className="mf-cream-section py-14">
        <div className="mf-container">
          <SectionTitle eyebrow="Quy trình làm việc" title="Đơn giản – Rõ ràng – Hiệu quả" />
          <div className="mt-8"><Timeline items={["Đăng ký", "Chuẩn bị", "Buổi tư vấn 1:1", "Nhận Money Map"]} /></div>
        </div>
      </section>

      <section className="mf-cream-section py-14 mf-soft-divider">
        <div className="mf-container">
          <SectionTitle eyebrow="Sản phẩm & dịch vụ" title="Hệ sinh thái Moneyfest" />
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {products.map((product) => (
              <div key={product.title} className="mf-card p-6">
                <icons.compass className="text-[var(--mf-gold)]" />
                <h3 className="mt-4 font-bold text-[var(--mf-midnight)]">{product.title}</h3>
                <p className="mf-muted mt-2 text-sm leading-6">{product.description}</p>
                <p className="mt-4 font-bold text-[var(--mf-gold)]">{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mf-dark-section py-12">
        <div className="mf-container grid gap-6 md:grid-cols-4">
          {["Độc lập", "Minh bạch", "Cá nhân hóa", "Đồng hành"].map((title) => (
            <IconBox key={title} dark icon={<icons.shield />} title={title}>Đặt lợi ích của bạn lên trước và giúp bạn ra quyết định bình tĩnh hơn.</IconBox>
          ))}
        </div>
      </section>

      <CTASection title="Sẵn sàng nhìn rõ bức tranh tài chính và làm chủ tương lai của bạn?" description="Bắt đầu bằng quiz miễn phí hoặc một buổi tư vấn để có bước tiếp theo rõ ràng." />
    </PageShell>
  );
}

