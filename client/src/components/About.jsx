function About() {
  const features = [
    { icon: 'auto_awesome', title: 'AI-Powered Insights', description: 'Our "Billy" AI assistant analyzes your spending patterns to predict future obligations and suggest optimizations.' },
    { icon: 'security', title: 'Bank-Grade Security', description: 'Your financial data is protected by industry-leading 256-bit encryption and multi-factor authentication protocols.' },
    { icon: 'group_add', title: 'Effortless Splitting', description: 'Share bills with housemates or partners instantly. No more awkward spreadsheets or manual calculations.' },
  ];

  const team = [
    { name: 'Jordan Vance', role: 'Founder & CEO', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDN3Cli-EgrGqlWIYGbXfq_sr_IecIE3F8MeuhvpxyXpWtUE3SYuyvHoCOOubSkWApWa5WEFtw9Jg6YVooaeoknUmMpXzaHXCZD-HCSX4JKLiv-Ku3SN5y0CKiptpD1UPFureej8N3tsHq3DxT4PVuBOFrHnwqkV0BerDfqs6NxOse0eELGdiCUKLwM3gevXjJ4Q1QfK2U7_xZUXhZlrC5-W1bN63yX5NT5lBqaBYIYKqwkBckW6_MbKyc_WYMSUKzLhPNdwrEMkzo', span: 'md:col-span-2 md:row-span-2' },
    { name: 'Sarah Drasner', role: 'CTO', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRaD-ulnVfgvzZsAe_f_2UZGkrWgIfXpo-spOeXzrlOl5O0i4iAga7mg1YKl2kgA5-aqpW9eXGfVdm3bV5DB62R_ZheErLYxbORqftG3tMH5BFx6f3c8gNdv5VTdsbysm4tHYxOx1tvWW6If5Jbu9TI9_s-LXMc3FEPJGBbofqEq38xb9MkA-pZ71kNBViSqZ90G54cai9w6Wwo_iktBw90eYPcjcRYGcs_GkR1uyC0mnASsbrc3DjdaOXAnQSQc5CEdMDXB_6Mw0', span: '' },
    { name: 'Leo Martinez', role: 'Head of Design', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_5KnCFNYV7oSqKd4uou8T5BsuoUp7ttK6z2czhPi9SGEPjsSSoa2aqZ0Mr8YCNjZ-YeGxE3iX2un1Uj853PtZdqJd0rb7aG6CL8RZezej2N0ZcTdEzPHTY8GyiaBB6fWArRBpPzbsj1cdtOfzesL1wmXBwbKp4f-z0jZnQGIoVu8WznmoXSCJztwWJ1m2v4FKSamty5fgnlzcpfEmVQd01pmBIXCzIif6MbSFqJDvsNRNID0r1WjMBxRovMzG7P9b_sc9am7NmlQ', span: '' },
    { name: 'Amina Okafor', role: 'Chief Financial Analyst', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBl99BBV_Q7lKnnYuAWs5JkJFboi-ZuvTxRv4ZrFHyF5WCV6Oo95sPj2FKE_tVKK1j-6qhbv1ecEQv-0fxjKSfdWP8ZgYSeNm3r79WWshxD6KkEltAVksehaZKZPF7yu-AC0cG1KE2H7jdR8Q60iS_wjMh14aek6ztyq1uaZLGsWd_pw7j_L_RsGABxjaJsqKltcYybHbxNFjrY5JBgTUn4dKxgRKEwNfCyi7Dxr8PTX_oFHYzmw2MUWs8rHyIon9fsfsQIXEVZUqk', span: '' },
    { name: 'David Kim', role: 'VP of Engineering', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3m3kom7fR3fdlA2Kf6OJXv3xGW7T3vtkgCLIsjD5y_rgwVwQ0OB2m7zYcnGRDTtBDChN9W1hyIT-xYkOqeFeitTwW7uH9c399rtgh0XAJlvWXx8o_58k6xe6Rwa4gtPZ8qjhtXG-ZdbDLaZW8be6S8Drc_uOEOJk_C3Uoj9Rv4lLd1z0OT2LynUhq4pQZBxHVdUtqZbUuJ01JlikTDyUwIzlv2A3euyhGA8icfWFMUdxsGw8OiuLxLY4aiRzpqDXsjISOHVveeA4', span: '' },
  ];

  return (
    <div>
      <section className="relative w-full h-[614px] flex items-center justify-center overflow-hidden">
        <img
          alt="Simplifying finance background"
          className="absolute inset-0 w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGmHLYXfeAb3AoZiv09RN1KZYKTrsv4JWZQ41mIHNiaTXRAegui76eC212qB3-9aOVxAKXYSVll65kF-F3msseogF_Saphd0x70vgIyoEkBZmFCF1Xng84U9VMWxGKM8es_arUUG8q2crDUlOyyZqvTUEuEsKfYCFHIMee6HbyicmCluyD_xGvGGWGO1C2WoYoOH2yuOUn8tn7Ps2MWWt4gsBaQt8yk-wLL6fTRmKHJtWfNl5Zfk4KzH2wdicixOpQhHJrmj4HbHQ"
        />
        <div className="absolute inset-0 bg-primary/20 backdrop-brightness-75" />
        <div className="relative z-10 text-center max-w-3xl px-gutter">
          <span className="text-label-md font-label-md text-secondary-container tracking-widest uppercase mb-sm block">Our Mission</span>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-primary mb-md">Simplifying finance for everyone</h1>
          <p className="text-body-lg font-body-lg text-on-primary/90">We believe that financial independence starts with clarity. Our platform transforms complex bill management into a seamless, automated experience that grows with you.</p>
        </div>
      </section>

      <section className="py-xl px-gutter max-w-container-max mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-lg gap-md">
          <div className="max-w-xl">
            <h2 className="text-headline-md font-headline-md text-on-surface mb-xs">The Only Bills Edge</h2>
            <p className="text-body-md font-body-md text-on-surface-variant">Experience a smarter way to manage your capital with features designed for the modern user.</p>
          </div>
          <div className="h-px flex-grow bg-outline-variant mb-4 hidden md:block" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {features.map((f) => (
            <div key={f.title} className="p-md bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center mb-md group-hover:bg-secondary-container transition-colors">
                <span className="material-symbols-outlined text-primary group-hover:text-on-secondary-container">{f.icon}</span>
              </div>
              <h3 className="text-headline-sm font-headline-sm text-on-surface mb-sm">{f.title}</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-xl bg-surface-container-low px-gutter">
        <div className="max-w-container-max mx-auto w-full">
          <div className="text-center mb-lg">
            <h2 className="text-headline-md font-headline-md text-on-surface">Meet the Visionaries</h2>
            <p className="text-body-md font-body-md text-on-surface-variant max-w-2xl mx-auto">A diverse group of fintech experts and engineers committed to democratizing financial wellness.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
            {team.map((m) => (
              <div key={m.name} className={`${m.span} bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden group`}>
                <div className={m.span ? 'h-full' : 'h-64'}>
                  <img alt={m.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={m.img} />
                </div>
                {!m.span && (
                  <div className="absolute bottom-0 left-0 right-0 p-lg bg-gradient-to-t from-black/80 to-transparent hidden">
                    <h4 className="text-headline-sm font-headline-sm text-on-primary">{m.name}</h4>
                    <p className="text-label-md font-label-md text-secondary-fixed">{m.role}</p>
                  </div>
                )}
                {!m.span && (
                  <div className="p-md">
                    <h4 className="text-label-md font-label-md text-on-surface">{m.name}</h4>
                    <p className="text-body-sm font-body-sm text-on-surface-variant">{m.role}</p>
                  </div>
                )}
              </div>
            ))}
            <div className="md:col-span-2 md:row-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden relative group">
              <img alt="CEO Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={team[0].img} />
              <div className="absolute bottom-0 left-0 right-0 p-lg bg-gradient-to-t from-black/80 to-transparent">
                <h4 className="text-headline-sm font-headline-sm text-on-primary">{team[0].name}</h4>
                <p className="text-label-md font-label-md text-secondary-fixed">{team[0].role}</p>
              </div>
            </div>
            {team.slice(1).map((m) => (
              <div key={m.name} className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden group">
                <div className="h-64 overflow-hidden">
                  <img alt={m.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" src={m.img} />
                </div>
                <div className="p-md">
                  <h4 className="text-label-md font-label-md text-on-surface">{m.name}</h4>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-xl px-gutter max-w-container-max mx-auto w-full text-center">
        <div className="glass-panel p-lg rounded-xl border border-outline-variant flex flex-col items-center gap-md">
          <h2 className="text-headline-md font-headline-md text-on-surface">Ready for clarity?</h2>
          <p className="text-body-md font-body-md text-on-surface-variant max-w-xl">Join over 50,000 individuals who have simplified their financial lives with Only Bills.</p>
          <div className="flex gap-md">
            <button className="px-lg py-sm bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity active:scale-95">Get Started Free</button>
            <button className="px-lg py-sm border border-outline text-on-surface rounded-lg font-label-md text-label-md hover:bg-surface-container transition-colors active:scale-95">Book a Demo</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
