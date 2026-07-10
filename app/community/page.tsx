import type { Metadata } from "next";
import { PageShell } from "@/components/site-shell";
import { CommunityCard, CTASection, HeroSection, IconBox, SectionTitle, Timeline, icons } from "@/components/marketing";
import { communityChannels, communityRules } from "@/data/community";

export const metadata: Metadata = {
  title: "Cộng đồng",
  alternates: { canonical: "/community" },
  description: "Cộng đồng Moneyfest dành cho những người đang học cách hiểu luật chơi của tiền bạc.",
};

export default function CommunityPage() {
  return (
    <PageShell>
      <HeroSection
        eyebrow="Cộng đồng Moneyfest"
        title={<>Đi cùng những người đang học cách hiểu luật chơi của tiền bạc.</>}
        description="Moneyfest Community là nơi bạn kết nối, học hỏi và áp dụng góc nhìn tài chính một cách bình tĩnh, thực tế và có hệ thống."
        image="/images/moneyfest/community/community-moneyfest.jpg"
        primary={{ href: "#channels", label: "Tham gia ngay" }}
        secondary={{ href: "#how", label: "Xem hoạt động cộng đồng" }}
        badges={["Học hỏi có chọn lọc", "Không FOMO", "Có framework", "Có cộng đồng đồng hành"]}
      />

      <section id="channels" className="mf-dark-section py-14">
        <div className="mf-container">
          <SectionTitle title="Chọn kênh phù hợp với bạn" light />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {communityChannels.map((channel) => <CommunityCard key={channel.title} {...channel} />)}
          </div>
        </div>
      </section>

      <section className="mf-dark-section py-10 mf-soft-divider">
        <div className="mf-container">
          <SectionTitle title="Vì sao nên tham gia Moneyfest Community?" light />
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {["Hiểu rõ hơn", "Bình tĩnh hơn", "Có người đồng hành", "Có bước tiếp theo"].map((item) => <IconBox key={item} dark icon={<icons.compass />} title={item}>Nhìn rõ hơn, bớt nhiễu hơn và hành động có hệ thống hơn.</IconBox>)}
          </div>
        </div>
      </section>

      <section id="how" className="mf-dark-section py-12">
        <div className="mf-container">
          <SectionTitle title="Cộng đồng này hoạt động như thế nào?" light />
          <div className="mt-8"><Timeline items={["Thứ Hai: Góc nhìn thị trường", "Thứ Tư: Case study phân bổ tài sản", "Thứ Sáu: Q&A hỏi đáp", "Cuối tuần: Bản tin email"]} /></div>
        </div>
      </section>

      <section className="mf-dark-section py-12">
        <div className="mf-container">
          <SectionTitle title="Các lớp tham gia" light />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {["Open Community – Miễn phí", "Newsletter Member – Miễn phí", "Patreon Member – Từ 149.000đ / tháng"].map((item) => <div key={item} className="mf-card-dark p-6"><h3 className="mf-display text-3xl font-bold text-[var(--mf-gold)]">{item}</h3><p className="mt-3 text-sm text-[rgba(244,240,232,0.72)]">Nội dung chọn lọc, tài nguyên và hoạt động phù hợp với mức độ bạn muốn tham gia.</p></div>)}
          </div>
        </div>
      </section>

      <section className="mf-dark-section py-12">
        <div className="mf-container">
          <SectionTitle title="Nguyên tắc cộng đồng" light />
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {communityRules.map((rule) => <IconBox key={rule.title} dark icon={<icons.lock />} title={rule.title}>{rule.description}</IconBox>)}
          </div>
        </div>
      </section>

      <CTASection title="Bắt đầu từ một cộng đồng, đi tới những quyết định tốt hơn." description="Chọn kênh phù hợp với bạn và tham gia Moneyfest Community ngay hôm nay." primary="Tham gia cộng đồng" />
    </PageShell>
  );
}

