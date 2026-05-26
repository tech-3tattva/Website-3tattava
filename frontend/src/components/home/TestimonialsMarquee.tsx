'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Marquee } from '@/components/ui/3d-testimonials'

const testimonials = [
  {
    name: 'Arjun Mehta',
    handle: 'Delhi · FITNESS',
    body: 'I was spending ₹3,000/month on pre-workouts. Replaced all of it with one honey stick every morning. Week 4, my trainer noticed the difference before I did.',
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
    stars: 5,
  },
  {
    name: 'Priya Sharma',
    handle: 'Mumbai · WELLNESS',
    body: 'Three coffees before noon was my normal. By week 3 with the resin, I was down to one — and I wasn\'t crashing at 3pm anymore. My husband noticed I was sleeping better.',
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
    stars: 5,
  },
  {
    name: 'Rohan Kapoor',
    handle: 'Bangalore · PROFESSIONAL',
    body: 'My iron was at 8.2. Tried everything — supplements upset my stomach. The honey sticks were the first thing I could take daily. Iron at 11.4 after 90 days.',
    img: 'https://randomuser.me/api/portraits/men/51.jpg',
    stars: 5,
  },
  {
    name: 'Kavitha Nair',
    handle: 'Chennai · ATHLETE',
    body: 'I run marathons. Recovery was always my weak point. Two weeks on the resin and my legs weren\'t sore the next morning. This is now a permanent part of my protocol.',
    img: 'https://randomuser.me/api/portraits/women/68.jpg',
    stars: 5,
  },
  {
    name: 'Siddharth Rao',
    handle: 'Hyderabad · BIOHACKER',
    body: 'I track everything — HRV, sleep cycles, testosterone. After 60 days on 3TATTAVA resin, my HRV improved 18%. This is the most measurable supplement I\'ve ever taken.',
    img: 'https://randomuser.me/api/portraits/men/33.jpg',
    stars: 5,
  },
  {
    name: 'Ananya Singh',
    handle: 'Pune · YOGA INSTRUCTOR',
    body: 'My students kept asking why I looked so energised. I\'d been taking the honey sticks for 6 weeks. Mental clarity is real. I don\'t teach a morning class without it.',
    img: 'https://randomuser.me/api/portraits/women/53.jpg',
    stars: 5,
  },
  {
    name: 'Vikram Bose',
    handle: 'Kolkata · ENTREPRENEUR',
    body: 'I work 14-hour days. The afternoon fog is gone. I thought it would take months — felt the difference in 10 days. The resin is now as non-negotiable as my morning water.',
    img: 'https://randomuser.me/api/portraits/men/22.jpg',
    stars: 5,
  },
  {
    name: 'Dr. Meera Pillai',
    handle: 'Kochi · PHYSICIAN',
    body: 'I recommended 3TATTAVA to three patients with mineral deficiency. Lab results at 90 days showed consistent improvement. I now take it myself.',
    img: 'https://randomuser.me/api/portraits/women/45.jpg',
    stars: 5,
  },
  {
    name: 'Rahul Gupta',
    handle: 'Gurgaon · CROSSFIT',
    body: 'Bench went up 8kg in 6 weeks. Sleep is deeper. Joints don\'t ache after heavy leg days. I was sceptical of Ayurveda. I\'m a convert now.',
    img: 'https://randomuser.me/api/portraits/men/85.jpg',
    stars: 5,
  },
]

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 mb-3">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 14 14" fill="#C8963E">
          <path d="M7 1l1.76 3.57L13 5.27l-3 2.92.71 4.13L7 10.1l-3.71 2.22.71-4.13L1 5.27l4.24-.7z" />
        </svg>
      ))}
    </div>
  )
}

function TestimonialCard({
  img, name, handle, body, stars,
}: (typeof testimonials)[number]) {
  return (
    <div className="w-[260px] rounded-xl border border-[rgba(200,150,62,0.15)] bg-[rgba(26,26,26,0.9)] p-5 flex flex-col gap-0">
      <StarRow count={stars} />
      <p className="text-[13px] leading-relaxed text-[rgba(245,240,235,0.72)] mb-4 flex-1">
        &ldquo;{body}&rdquo;
      </p>
      <div className="flex items-center gap-2.5 mt-auto">
        <Avatar className="size-8 shrink-0">
          <AvatarImage src={img} alt={name} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <span className="text-[12px] font-medium text-[#F5F0EB] truncate"
            style={{ fontFamily: 'var(--font-jost), sans-serif' }}>
            {name}
          </span>
          <span className="text-[10px] text-[#C8963E] tracking-wide truncate"
            style={{ fontFamily: 'var(--font-jost), sans-serif' }}>
            {handle}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function TestimonialsMarquee() {
  const col1 = testimonials.slice(0, 3)
  const col2 = testimonials.slice(3, 6)
  const col3 = testimonials.slice(6, 9)

  return (
    <section className="relative py-24 overflow-hidden bg-[#111]">
      {/* Header */}
      <div className="text-center mb-16 px-6">
        <p className="text-[11px] tracking-[0.3em] text-[#C8963E] uppercase mb-3"
          style={{ fontFamily: 'var(--font-jost), sans-serif' }}>
          Social Proof
        </p>
        <h2 className="text-[clamp(36px,4.5vw,56px)] font-bold text-[#F5F0EB] leading-tight"
          style={{ fontFamily: 'var(--font-cormorant), serif' }}>
          Real Results. Real People.
        </h2>
        <h2 className="text-[clamp(28px,3.5vw,44px)] font-light italic text-[#C8963E]"
          style={{ fontFamily: 'var(--font-cormorant), serif' }}>
          Real Blood Work.
        </h2>
      </div>

      {/* 3D Marquee container */}
      <div
        className="relative flex h-[480px] w-full items-center justify-center overflow-hidden [perspective:800px]"
      >
        <div
          className="flex flex-row items-center gap-4"
          style={{
            transform:
              'translateX(-60px) translateY(20px) translateZ(-60px) rotateX(18deg) rotateY(-8deg) rotateZ(12deg)',
          }}
        >
          <Marquee vertical pauseOnHover repeat={3} className="[--duration:35s] h-[480px]">
            {col1.map((r) => <TestimonialCard key={r.name} {...r} />)}
          </Marquee>
          <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:42s] h-[480px]">
            {col2.map((r) => <TestimonialCard key={r.name} {...r} />)}
          </Marquee>
          <Marquee vertical pauseOnHover repeat={3} className="[--duration:38s] h-[480px]">
            {col3.map((r) => <TestimonialCard key={r.name} {...r} />)}
          </Marquee>
        </div>

        {/* Gradient masks */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-[#111]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#111]" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-[#111]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-[#111]" />
      </div>

      {/* Footer note */}
      <p className="text-center mt-10 text-[12px] text-[rgba(245,240,235,0.3)]"
        style={{ fontFamily: 'var(--font-jost), sans-serif' }}>
        These are real customers. We don't edit reviews. We don't pay for testimonials.
      </p>
    </section>
  )
}
