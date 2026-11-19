/* ==========================================================================
   CREATIVE BEING — story data.
   Every "text" is the group's script, word for word. Long speeches are shown
   across several dialogue boxes, split only at sentence ends.

   Beat fields
     who    narrator | jasmine | advisor
     face   expression for the speaker
     faces  expressions for anyone on stage   { jasmine: "happy" }
     poses  stage directions, acted out       { jasmine: "writing", advisor: "typing" }
            jasmine: writing | slumped | ""      advisor: typing | chin | folder | ""
     cam    wide | jasmine | advisor | desk      (a character's line defaults to them)
     act    penDrop | folder
     on     [["words in the line", "act"]]       act fires when that box appears
   Lines that mention AI get the glitch automatically.
   ========================================================================== */

const STORY = {
  meters: { creative: 50, security: 50 },

  opening: [
    { who: "narrator", cam: "wide", faces: { jasmine: "neutral", advisor: "neutral" }, poses: { jasmine: "writing", advisor: "typing" },
      text: "Jasmine is struggling to decide whether to take the leap and major in the arts or to opt for the sciences to ensure a stable financial future and guaranteed jobs." },
    { who: "narrator", cam: "jasmine", faces: { jasmine: "stressed" },
      text: "The concern weighing on Jasmine’s mind is how Artificial Intelligence is becoming an active threat in the creative world and might prohibit Jasmine from pursuing the career in fine arts that she desires." },
    { who: "narrator", cam: "wide", faces: { jasmine: "neutral" },
      text: "Jasmine is sitting in a chair across from her academic advisor in a cramped office." },
    { who: "narrator", cam: "desk", poses: { jasmine: "writing", advisor: "typing" },
      text: "The academic advisor types furiously on her computer as Jasmine contemplates the form she is filling out for her 5-year plan." },
    { who: "advisor", face: "neutral", poses: { advisor: "" },                       // Looks up from computer
      text: "Where do you see yourself five years from now, Jasmine?" },
    { who: "jasmine", face: "neutral", poses: { jasmine: "" },
      text: "I used to know. But now… I’m not sure whether following my childhood dream of being an artist is the wisest choice." },
    { who: "advisor", face: "neutral", poses: { advisor: "chin" },                   // Props their chin on a fist
      text: "Why is that?" },
    { who: "jasmine", face: "stressed",
      text: "Well, I just keep hearing about more cases of people using AI to create something that was meant to be made by humans. Art being at the forefront of it all." },
    { who: "narrator", cam: "wide", faces: { jasmine: "stressed" }, poses: { jasmine: "slumped" }, act: "penDrop",
      text: "Jasmine sinks back into her chair, letting her pen drop to the desk as she looks down." },
    { who: "jasmine", face: "stressed",
      text: "And I know art made by a robot is nothing in comparison to art made by humans but… My parents aren’t willing to support me through a degree if that degree won’t get me a career where I can support myself. But if I go for the arts, like I really want, AI might turn that career into mush." },
    { who: "advisor", face: "hopeful", poses: { advisor: "" },
      text: "That’s a hard decision to make, Jasmine. But have you considered the fact that you might be the one to make a difference?" },
    { who: "jasmine", face: "surprised", poses: { jasmine: "" },                     // Jasmine lifts her head
      text: "What do you mean?" },
    { who: "advisor", face: "smiling",
      text: "Choosing a job in the arts could motivate others in your exact position to do the same. Maybe then we could stand a chance against artificial intelligence." },
    { who: "jasmine", face: "annoyed",
      text: "Yeah, but that doesn’t solve the part about my parents. Who knows what the future might hold but I’m not so sure now is the right time to be taking a leap." },
    { who: "advisor", face: "neutral", on: [["drains your creative bucket", "bucketTease"]],
      text: "It’s your decision, Jasmine. Therefore, I urge you to think it over carefully. Don’t make a rash choice just because it seems the easiest one right now. Make sure to keep future you in mind. What will make future Jasmine excited? Is it a career that brings you safety or one that keeps you on the edge of your seat? A career that drains your creative bucket, or one that has it overflowing?" },
    { who: "jasmine", face: "stressed",
      text: "How am I supposed to know how I will feel years from now? How am I expected to make such a big decision like this without knowing?" },
    { who: "advisor", face: "smiling",
      text: "I can help you with that. I will give you three options and I want you to go with what your gut tells you." },
    { who: "narrator", cam: "desk", faces: { jasmine: "neutral", advisor: "smiling" }, poses: { advisor: "folder" }, act: "folder",
      text: "The Academic Advisor pulls out a folder and we shift to the audience for a decision." }
  ],

  decision1: [
    { id: "leap", title: "Take the leap", color: "#e8813a", effects: { creative: 25, security: -20 },
      desc: "Follow a career in the arts, life is too short to lead a life that will only make you miserable." },
    { id: "middle", title: "Meet in the middle", color: "#6f9e62", effects: { creative: 10, security: 10 },
      desc: "Do a minor in the arts and major in something stable. Satisfy the creative in you while having a backup plan." },
    { id: "defeat", title: "Accept defeat", color: "#4f7fb8", effects: { creative: -25, security: 25 },
      desc: "AI will probably overtake the creative world before you can become successful so choose a career in something that will benefit from the rise of artificial intelligence." }
  ],

  branches: {
    leap: {
      grade: "warm",
      beats: [
        { who: "narrator", cam: "jasmine", faces: { jasmine: "happy", advisor: "smiling" }, poses: { jasmine: "" },
          text: "You’ve chosen to take the leap! Good choice, life is too short to not take the risk and follow a career that will make you happy. You may face some challenges but having your creative bucket fulfilled will make it all worth it." }
      ],
      prompt: { who: "narrator", cam: "desk", faces: { jasmine: "neutral" },
        text: "Now, you must decide what school you will attend for your fine arts degree. What will it be?" },
      cards: [
        { id: "uvic", title: "UVic", color: "#3f8fb0", effects: { creative: 15, security: -5 },
          desc: "UVic has a great fine arts faculty but you would have to move away from your home in Toronto." },
        { id: "uoft", title: "UofT", color: "#8a5aa8", effects: { creative: 10, security: 5 },
          desc: "The University of Toronto is the home of Alumni Margaret Attwood and it’s close to home. However, the acceptance rates are dire." },
        { id: "nouni", title: "No University", color: "#d9536a", effects: { creative: 20, security: -20 },
          desc: "A bold choice, you want to get right into the arts world and establish yourself as a creator before AI can dominate. But the risk of not having a back up plan weighs on your shoulders." }
      ]
    },
    middle: {
      grade: "mixed",
      beats: [
        { who: "narrator", cam: "jasmine", faces: { jasmine: "neutral", advisor: "smiling" }, poses: { jasmine: "" },
          text: "You’ve chosen to meet in the middle! It’s a cautious choice that gives you a safety net but allows you to still pursue a career in the arts. But if AI makes a career in the arts unstable, you can always switch to your backup plan." }
      ],
      prompt: { who: "narrator", cam: "desk", faces: { jasmine: "neutral" }, text: "But what field will you choose?" },
      cards: [
        { id: "physics", title: "Physics", color: "#3d5a99", effects: { creative: 5, security: 10 },
          desc: "You could use the knowledge to write stories about space but math has never been your strong suit." },
        { id: "psychology", title: "Psychology", color: "#c46aa0", effects: { creative: 10, security: 5 },
          desc: "Wouldn’t it be cool to interpret psychology as an art form? But the brain is a complicated organ and there might be a lot for you to remember." },
        { id: "business", title: "Business", color: "#c9902a", effects: { creative: 5, security: 15 },
          desc: "You could use a degree in business to help excel in the publishing industry." }
      ]
    },
    defeat: {
      grade: "cool",
      beats: [
        { who: "narrator", cam: "jasmine", faces: { jasmine: "stressed", advisor: "neutral" }, poses: { jasmine: "slumped" },
          text: "You’ve chosen to accept defeat! Artificial Intelligence will take over the creative world before Jasmine can establish herself or make a living. She accepts defeat and majors in science so that she never has to worry if her job might disappear." }
      ],
      prompt: { who: "narrator", cam: "desk", faces: { jasmine: "neutral" }, poses: { jasmine: "" },
        text: "Okay, so no learning about the intricacies of storytelling or acting in a production of your favorite play, but how will you fill your creative bucket and not get burnt out?" },
      cards: [
        { id: "hour", title: "Set aside an hour each day to work on your various projects", color: "#d28a3c", effects: { creative: 15, security: 0 },
          desc: "It seems easy but just wait until you discover an assignment you didn’t know existed." },
        { id: "club", title: "Join an arts club and meet other future creatives", color: "#5f9e7e", effects: { creative: 20, security: 0 },
          desc: "This will fulfill your creative bucket and give you a chance to share your art and receive feedback." },
        { id: "blog", title: "Begin a blog and start to establish yourself as an artist so that you can create art when you are not in the lab", color: "#5b78c4", effects: { creative: 25, security: 0 },
          desc: "You can have a career in the arts without the weight of possible failure on your shoulders." }
      ]
    }
  },

  outcomes: {
    uvic: { title: "UVic", path: "leap", outfit: "smock", doodles: ["wave", "mountain", "book"],
      text: "UVic! A great choice and one that will force you to grow as a person and a writer. You will miss your family but Victoria is a beautiful city and there are many friends to be made. You go on to graduate and become a successful author who advocates for the arts against AI forces." },
    uoft: { title: "UofT", path: "leap", outfit: "turtleneck", doodles: ["clapper", "star", "book"],
      text: "Staying in your comfort zone, a smart choice. You can live at home and commute to school, you meet many writers in your time at the University of Toronto, and even get to hear Margaret Attwood speak at a convention in your third year. You graduate and discover the world of directing and end up working on several TV series." },
    nouni: { title: "No University", path: "leap", outfit: "hoodie", doodles: ["phone", "heart", "book"],
      text: "You take a path of unknowns, you’re bold. However, you build up a successful presence on social media and share your writing with your followers. A literary agent reaches out after a video pitch of your new novel goes viral and agrees to represent you. Penguin Random House chooses to publish your book and it goes on to impact lives worldwide." },
    physics: { title: "Physics", path: "middle", outfit: "labcoat", doodles: ["star", "moon", "telescope"],
      text: "Physics might get cast in a bad light sometimes but you are able to use what you learn to write an empowering story about a woman who dominates the astronomy field and it inspires many. You write on the side while spending your days in a laboratory in Alaska, studying strange anomalies in the night sky." },
    psychology: { title: "Psychology", path: "middle", outfit: "smock", doodles: ["brain", "palette", "frame"],
      text: "Yes, psychology gets confusing but you find an amazing tutor and get a job as a research assistant right out of school. You spend your evenings and weekends painting and even get some of your art put on display in a gallery." },
    business: { title: "Business", path: "middle", outfit: "blazer", doodles: ["chart", "book", "star"],
      text: "You get a job as a marketer at Harper Collins and use your business degree to expand the marketing department. You end up loving it but you still make sure to make time for writing." },
    hour: { title: "Set aside an hour each day", path: "defeat", outfit: "knit", doodles: ["clock", "yarn", "heart"],
      text: "Even though you don’t go the arts route, you still make time for being creative. By doing so you don’t let Artificial Intelligence overtake your creativity. You try out a few different mediums and end up loving fibre art." },
    club: { title: "Join an arts club", path: "defeat", outfit: "apron", doodles: ["palette", "brush", "heart"],
      text: "You meet a group of prospect artists and start getting together outside of the weekly club. It gives you a chance to explore different areas of art without the pressure of perfection." },
    blog: { title: "Begin a blog", path: "defeat", outfit: "cardigan", doodles: ["laptop", "bubble", "heart"],
      text: "Despite choosing not to pursue a career in the arts, you are convinced by a friend that you cannot let Artificial Intelligence make you give up on being creative. You start a blog where you advocate for the importance of creativity and share some of your art." }
  },

  /* PROPOSED: not in the script (see FLAGS.md) */
  ui: {
    title: "Creative Being", tagline: "What is creativity?", authors: "Oliver Morrissey · Owen Dwyer · Lily Hutchinson",
    cardHint: "drag or tap a card", later: "Five years later…",
    closing: "Every path kept her creative. What does creativity mean to you?"
  }
};
if (typeof module !== "undefined") module.exports = { STORY };
