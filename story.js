/* ==========================================================================
   CREATIVE BEING — story data (updated script, Nov 22).
   Every "text" is the group's script word for word, except the typo flagged
   in FLAGS.md. Long speeches show across several boxes, split at sentence ends.

   Beat fields
     who    narrator | jasmine | advisor
     face   expression for the speaker at the start of the line
            jasmine: neutral surprised relieved happy excited sad stressed
            advisor: smiling happy brow defeated
     faces  expressions for anyone on stage   { jasmine: "sad" }
     poses  stage directions                   jasmine: writing | slumped | ""
                                               advisor: typing | chin | lean | ""
     cam    wide | jasmine | advisor | desk     (a character's line defaults to them)
     act    penDrop | folder | nod | shrug
   Inside text, {face} changes the speaker's expression at that point, e.g.
   "{sad}I would have to move away… but {happy}I know…". It is not shown.
   ========================================================================== */

const STORY = {
  meters: { creative: 50, security: 50 },

  opening: [
    { who: "narrator", cam: "wide", faces: { jasmine: "relieved", advisor: "smiling" }, poses: { jasmine: "writing", advisor: "typing" },
      text: "Jasmine is struggling to decide whether to take the leap and major in the arts or to opt for the sciences to ensure a stable financial future and guaranteed jobs." },
    { who: "narrator", cam: "jasmine", faces: { jasmine: "stressed" },
      text: "The concern weighing on Jasmine’s mind is how Artificial Intelligence is becoming an active threat in the creative world and might prohibit Jasmine from pursuing the career in fine arts that she desires." },
    { who: "narrator", cam: "wide", faces: { jasmine: "neutral" },
      text: "Jasmine is sitting worriedly in a chair across from her academic advisor in a cramped office." },
    { who: "narrator", cam: "desk", faces: { jasmine: "relieved" }, poses: { jasmine: "writing", advisor: "typing" },
      text: "The academic advisor types furiously on her computer as Jasmine contemplates the form she is filling out for her 5-year plan." },
    { who: "advisor", face: "smiling", faces: { jasmine: "surprised" }, poses: { advisor: "" },  // Looks up from their computer with a smile
      text: "Where do you see yourself five years from now, Jasmine?" },
    { who: "jasmine", face: "sad", poses: { jasmine: "" },                           // Hesitant and discouraged
      text: "I used to know. But now… I’m not sure whether following my childhood dream of being an artist is the wisest choice." },
    { who: "advisor", face: "smiling", faces: { jasmine: "neutral" }, poses: { advisor: "chin" },                   // Props their chin on a fist
      text: "Why is that?" },
    { who: "jasmine", face: "neutral",
      text: "Well, I just keep hearing about more cases of people using {stressed}AI to create something that was meant to be made by humans. Art being at the forefront of it all." },
    { who: "narrator", cam: "wide", faces: { jasmine: "stressed" }, poses: { jasmine: "slumped" }, act: "penDrop",
      text: "Jasmine sinks back into her chair, letting her pen drop to the desk as she looks down, her brows furrowed." },
    { who: "jasmine", face: "stressed",
      text: "And I know art made by a robot is nothing in comparison to art made by humans but… {sad}My parents aren’t willing to support me through a degree if that degree won’t get me a career where I can support myself. {stressed}But if I go for the arts, like I really want, AI might turn that career into mush." },
    { who: "advisor", face: "happy", faces: { jasmine: "neutral" }, poses: { advisor: "" },  // Encouraging expression
      text: "That’s a hard decision to make, Jasmine. But have you considered the fact that you might be the one to make a difference?" },
    { who: "jasmine", face: "surprised", poses: { jasmine: "" },                     // Jasmine lifts her head
      text: "What do you mean?" },
    { who: "advisor", face: "smiling", faces: { jasmine: "excited" },
      text: "Choosing a job in the arts could motivate others in your exact position to do the same. Maybe then we could stand a chance against artificial intelligence." },
    { who: "jasmine", face: "relieved",
      text: "Yeah, but that doesn’t solve the part about my parents. Who knows what the future might hold {sad}but I’m not so sure now is the right time to be taking a leap." },
    { who: "advisor", face: "smiling", faces: { jasmine: "neutral" },
      text: "It’s your decision, Jasmine. Therefore, I urge you to think it over carefully. Don’t make a rash choice just because it seems the easiest one right now. Make sure to keep future you in mind. What will make future Jasmine excited? {brow}Is it a career that brings you safety or one that keeps you on the edge of your seat? A career that drains your creative bucket, or one that has it overflowing?",
      on: [["drains your creative bucket", "bucketTease"]] },
    { who: "jasmine", face: "surprised",
      text: "How am I supposed to know how I will feel years from now? How am I expected to make such a big decision like this without knowing?" },
    { who: "advisor", face: "smiling", faces: { jasmine: "happy" }, act: "folder",                                // pulls out a folder
      text: "I can help you with that. I will give you three options and I want you to go with what your gut tells you." }
  ],

  /* First folder: the three options. Effects are the approved meter table. */
  decision1: [
    { id: "leap", title: "Take the leap", desc: "Follow a career in the arts, life is too short to lead a life that will only make you miserable.", color: "#e8813a", effects: { creative: 25, security: -20 } },
    { id: "middle", title: "Meet in the middle", desc: "Do a minor in the arts and major in something stable. Satisfy the creative in you while having a backup plan.", color: "#6f9e62", effects: { creative: 10, security: 10 } },
    { id: "defeat", title: "Accept defeat", desc: "AI will probably overtake the creative world before you can become successful so choose a career in something that will benefit from the rise of artificial intelligence.", color: "#4f7fb8", effects: { creative: -25, security: 25 } }
  ],

  branches: {
    leap: {
      grade: "warm",
      beats: [
        { who: "advisor", face: "happy", faces: { jasmine: "happy" },
          text: "You’ve chosen to take the leap! Good choice, life is too short to not take the risk and follow a career that will make you happy. You may face some challenges but having your creative bucket fulfilled will make it all worth it." },
        { who: "jasmine", face: "relieved",
          text: "I feel better! It might get hard sometimes but at least I am doing what I love." },
        { who: "advisor", face: "smiling", faces: { jasmine: "excited" }, poses: { advisor: "lean" },              // Leans forward on elbows
          text: "Now, you must decide what school you will attend for your fine arts degree. There are so many great schools. What will it be?" }
      ],
      cards: [
        { id: "uvic", title: "UVic", desc: "UVic has a great fine arts faculty but you would have to move away from your home in Toronto.", color: "#3f8fb0", effects: { creative: 15, security: -5 } },
        { id: "uoft", title: "UofT", desc: "The University of Toronto is the home of Alumni Margaret Atwood and it’s close to home. However, the acceptance rates are dire.", color: "#8a5aa8", effects: { creative: 10, security: 5 } },
        { id: "nouni", title: "No University", desc: "A bold choice, you want to get right into the arts world and establish yourself as a creator before AI can dominate. But the risk of not having a back up plan weighs on your shoulders.", color: "#d9536a", effects: { creative: 20, security: -20 } }
      ]
    },
    middle: {
      grade: "mixed",
      beats: [
        { who: "advisor", face: "smiling", faces: { jasmine: "surprised" },
          text: "You’ve chosen to meet in the middle! It’s a cautious choice that gives you a safety net but allows you to still pursue a career in the arts. But if AI makes a career in the arts unstable, you can always switch to your backup plan." },
        { who: "jasmine", face: "relieved",
          text: "I hadn’t thought of this, but I can major in something safe and minor in the arts." },
        { who: "advisor", face: "happy", faces: { jasmine: "happy" },
          text: "But what will your safe choice be?" }
      ],
      cards: [
        { id: "physics", title: "Physics", desc: "You could use the knowledge to write stories about space but math has never been your strong suit.", color: "#3d5a99", effects: { creative: 5, security: 10 } },
        { id: "psychology", title: "Psychology", desc: "Wouldn’t it be cool to interpret psychology as an art form? But the brain is a complicated organ and there might be a lot for you to remember.", color: "#c46aa0", effects: { creative: 10, security: 5 } },
        { id: "business", title: "Business", desc: "You could use a degree in business to help excel in the publishing industry.", color: "#c9902a", effects: { creative: 5, security: 15 } }
      ]
    },
    defeat: {
      grade: "cool",
      beats: [
        { who: "advisor", face: "defeated", faces: { jasmine: "neutral" },
          text: "You’ve chosen to accept defeat! Artificial Intelligence will take over the creative world before you can establish yourself or make a living." },
        { who: "jasmine", face: "happy",
          text: "I’ll major in the science field so that I never have to worry if my job might disappear." },
        { who: "advisor", face: "defeated", faces: { jasmine: "relieved" },
          text: "Okay, so no learning about the intricacies of storytelling or acting in a production of your favorite play, {happy}but how will you fill your creative bucket and not get burnt out?" }
      ],
      cards: [
        { id: "hour", title: "Set aside an hour each day to work on your various projects", desc: "It seems easy but just wait until you discover an assignment you didn’t know existed.", color: "#d28a3c", effects: { creative: 15, security: 0 } },
        { id: "club", title: "Join an arts club and meet other future creatives", desc: "This will fulfill your creative bucket and give you a chance to share your art and receive feedback.", color: "#5f9e7e", effects: { creative: 20, security: 0 } },
        { id: "blog", title: "Begin a blog and start to establish yourself as an artist so that you can create art when you are not in the lab", desc: "You can have a career in the arts without the weight of possible failure on your shoulders.", color: "#5b78c4", effects: { creative: 25, security: 0 } }
      ]
    }
  },

  /* Each possibility: a short exchange at the desk, then the outcome, read by
     the advisor over a themed "five years later" scene. */
  outcomes: {
    uvic: { title: "UVic", path: "leap",
      dialogue: [
        { who: "advisor", face: "smiling", poses: { advisor: "" }, text: "UVic has a great fine arts faculty." },
        { who: "jasmine", face: "sad", text: "{sad}I would have to move away from my home in Toronto but {happy}I know I will meet many friends." }
      ],
      text: "UVic! A great choice and one that will force you to grow as a person and a writer. You go on to graduate and become a successful author who advocates for the arts against AI forces." },
    uoft: { title: "UofT", path: "leap",
      dialogue: [
        { who: "advisor", face: "smiling", poses: { advisor: "" }, text: "The University of Toronto is the home of Alumni Margaret Atwood {happy}and it’s close to home." },
        { who: "jasmine", face: "sad", text: "{sad}The acceptance rates are dire but {happy}I know I can put together a great portfolio and resume that demonstrates my skills." }
      ],
      face: "happy",
      text: "Staying in your comfort zone, a smart choice. You can live at home and commute to school, you will meet many writers in your time at the University of Toronto, and might even get to hear Margaret Atwood speak at a convention." },
    nouni: { title: "No University", path: "leap",
      dialogue: [
        { who: "advisor", face: "smiling", poses: { advisor: "" }, act: "nod", text: "A bold choice, you want to get right into the arts world and establish yourself as a creator before AI can dominate." },
        { who: "jasmine", face: "relieved", act: "shrug", text: "It’s scary but why not?" }
      ],
      text: "You take a path of unknowns, you’re bold. A literary agent reaches out after a video pitch of your new novel goes viral and agrees to represent you. Penguin Random House chooses to publish your book and it goes on to impact lives worldwide." },
    physics: { title: "Physics", path: "middle",
      dialogue: [
        { who: "advisor", face: "happy", text: "You can use physics to write stories about space!" },
        { who: "jasmine", face: "relieved", text: "Math has never been my strong suit but I can get a tutor." }
      ],
      text: "Physics might get cast in a bad light sometimes but you can use what you learn to write an empowering story about a woman who dominates the astronomy field and maybe it goes on to inspire many. You can write on the side while spending your days in a laboratory somewhere cool, studying strange anomalies in the night sky." },
    psychology: { title: "Psychology", path: "middle",
      dialogue: [
        { who: "advisor", face: "smiling", text: "Wouldn’t it be cool to interpret psychology as an art form? {happy}The brain is a complicated organ." },
        { who: "jasmine", face: "excited", text: "I have always been intrigued by psychology." }
      ],
      text: "You can find an amazing tutor and get a job as a research assistant right out of school. You can spend your evenings and weekends painting and even get some of your art put on display in galleries." },
    business: { title: "Business", path: "middle",
      dialogue: [
        { who: "advisor", face: "smiling", text: "You could use a degree in business to help excel in the publishing industry." },
        { who: "jasmine", face: "excited", text: "Exactly! Then if a job comes up in publishing I can take it." }
      ],
      text: "You can get a job as a marketer at Harper Collins and use your business degree to expand the marketing department. You could end up loving it and still make time for writing." },
    hour: { title: "Set aside an hour each day", path: "defeat",
      dialogue: [
        { who: "jasmine", face: "neutral", text: "I could set aside time each day to work on my projects." },
        { who: "advisor", face: "brow", text: "It seems easy but just wait until you discover an assignment you didn’t know existed." },
        { who: "jasmine", face: "excited", text: "I’ll make it work." }
      ],
      text: "Even though you don’t go the arts route, you will still make time for being creative. By doing so you won’t let Artificial Intelligence overtake your creativity. {brow}You might even try out a few different mediums of art." },
    club: { title: "Join an arts club", path: "defeat",
      dialogue: [
        { who: "jasmine", face: "happy", text: "Well, I could join an arts club and meet other people who love to create." }
      ],
      face: "happy",
      text: "Great! This will fulfill your creative bucket and give you a chance to share your art and receive feedback. It gives you a chance to explore different areas of art without the pressure of perfection." },
    blog: { title: "Begin a blog", path: "defeat",
      dialogue: [
        { who: "jasmine", face: "neutral", text: "What if I were to begin a blog? I could still share my art and I could work on it when I’m not in the lab." }
      ],
      face: "happy",
      text: "You can have a career in the arts without the weight of possible failure on your shoulders.Despite choosing not to pursue a career in the arts, you start a blog where you advocate for the importance of creativity and share some of your art." }
  },

  /* PROPOSED: not in the script (see FLAGS.md) */
  ui: {
    title: "Creative Being", tagline: "What is creativity?", authors: "Oliver Morrissey · Owen Dwyer · Lily Hutchinson",
    cardHint: "drag or tap a card", later: "Five years later…",
    closing: "Every path kept her creative. What does creativity mean to you?"
  }
};
if (typeof module !== "undefined") module.exports = { STORY };
