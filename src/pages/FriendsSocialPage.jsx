const quickActions = [
  {
    title: 'Anonymous Break Match',
    description: 'Find a short break with a student who also wants a quiet chat.',
    action: 'Find a match',
    icon: 'diversity_3',
  },
  {
    title: 'Verified Meetups',
    description: 'Meet only with verified students and share location after consent.',
    action: 'Check requests',
    icon: 'verified_user',
  },
  {
    title: 'Social Skills Practice',
    description: 'Small guided prompts to build confidence before you meet.',
    action: 'Start practice',
    icon: 'psychology',
  },
]

const skillSteps = [
  {
    title: 'Start with a soft hello',
    description: 'Say hi and ask how their week is going.',
  },
  {
    title: 'Use a small question',
    description: 'Ask about a class, shift, or campus cafe.',
  },
  {
    title: 'Share a short plan',
    description: 'Say what you are doing next and invite them.',
  },
  {
    title: 'End with a clear close',
    description: 'Thank them and set a short next step.',
  },
]

const FriendsSocialPage = () => {
  return (
    <div className="min-h-screen bg-background text-on-background px-6 py-12 md:px-12">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="font-h1 text-h1 text-on-surface">Friends & Social</h1>
            <p className="font-body-md text-on-surface-variant">
              Safe and low pressure ways to connect with other students.
            </p>
          </div>
          <button
            className="px-5 py-2.5 rounded-full bg-secondary-container text-on-secondary-container font-label-md"
            type="button"
          >
            Set Social Goal
          </button>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <div key={action.title} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-primary-container/40 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">{action.icon}</span>
              </div>
              <div className="space-y-2">
                <h2 className="font-h3 text-h3 text-on-surface">{action.title}</h2>
                <p className="text-body-sm text-on-surface-variant">{action.description}</p>
              </div>
              <button className="px-4 py-2 rounded-full bg-primary text-on-primary font-label-md" type="button">
                {action.action}
              </button>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50 space-y-5">
            <div>
              <h2 className="font-h3 text-h3 text-on-surface">Social Skills Toolkit</h2>
              <p className="text-body-sm text-on-surface-variant">Short steps you can use before a meetup.</p>
            </div>
            <div className="space-y-4">
              {skillSteps.map((step, index) => (
                <div key={step.title} className="flex gap-4 bg-surface-container-low rounded-2xl p-4">
                  <div className="h-8 w-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-label-lg text-on-surface">{step.title}</h3>
                    <p className="text-body-sm text-on-surface-variant">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50 space-y-4">
              <h2 className="font-h3 text-h3 text-on-surface">Safety & Consent</h2>
              <ul className="space-y-3 text-body-sm text-on-surface-variant">
                <li>Only verified students can accept a meetup request.</li>
                <li>Location sharing stays off until both users agree.</li>
                <li>You can end a match at any time, no questions asked.</li>
                <li>Report and block tools are always visible.</li>
              </ul>
            </div>
            <div className="bg-secondary-container/20 rounded-3xl p-6 border border-secondary-container/40 space-y-3">
              <h3 className="font-label-lg text-on-secondary-container">Weekly Social Goal</h3>
              <p className="text-body-sm text-on-secondary-container">
                Aim for one friendly chat or a short study break this week.
              </p>
              <button className="px-4 py-2 rounded-full bg-secondary text-white font-label-md" type="button">
                Log a Meetup
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default FriendsSocialPage
