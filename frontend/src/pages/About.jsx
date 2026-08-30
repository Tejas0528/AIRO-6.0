import { siteConfig } from "../data/siteConfig";

export default function About() {
  return (
    <div className="pt-32 pb-24 section-pad max-w-3xl mx-auto">
      <h1 className="font-display text-3xl md:text-4xl text-mist mb-8">ABOUT AIRO 6.0</h1>

      <div className="space-y-10 text-mist/75 leading-relaxed">
        <div>
          <h2 className="text-xs tracking-widest2 text-cyan-400 mb-3">OVERVIEW</h2>
          <p>
            AIRO 6.0 is {siteConfig.collegeName}'s technical symposium — six original challenges, each brought
            to life by one of six original transforming machines. It's built for students who want to test
            ideas, build under pressure, and engineer real solutions across AI, security, and software.
          </p>
        </div>

        <div>
          <h2 className="text-xs tracking-widest2 text-cyan-400 mb-3">VISION</h2>
          <p>To give students a platform where technical ambition meets hands-on, competitive execution.</p>
        </div>

        <div>
          <h2 className="text-xs tracking-widest2 text-cyan-400 mb-3">MISSION</h2>
          <p>
            To run events that are rigorous enough to matter on a resume and engaging enough that participants
            actually want to be there — from strategic bidding to live cybercrime investigation to agentic AI
            development.
          </p>
        </div>

        <div>
          <h2 className="text-xs tracking-widest2 text-cyan-400 mb-3">WHY PARTICIPATE</h2>
          <p>
            Each event is designed around a real skill: negotiation and strategy, digital forensics, AI agent
            design, hands-on workshop learning, research communication, and competitive coding.
          </p>
        </div>

        <div>
          <h2 className="text-xs tracking-widest2 text-cyan-400 mb-3">WHAT PARTICIPANTS EXPERIENCE</h2>
          <p>
            A cinematic, character-driven event experience alongside serious technical challenges — teams
            registering, competing, and getting scanned in through the same futuristic AIRO 6.0 platform.
          </p>
        </div>
      </div>
    </div>
  );
}
