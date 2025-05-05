

"use client";

import React, { useState, useEffect, useRef } from 'react';
import { User, Briefcase, Brain, Award, Folder, GraduationCap, Newspaper, Mail, Cloud, Terminal, Server, BrainCircuit, Gamepad2, Rocket, MapPin, Lightbulb, BarChart, Link as LinkIcon, Info, ShieldCheck, University, Building, Database, Instagram, Linkedin, Github, Twitter, Coffee, DollarSign, MonitorSmartphone, Wrench, Paintbrush, HelpCircle, Users, Code, ListChecks, Target, type LucideIcon } from 'lucide-react';
import { DesktopIcon } from '@/components/desktop/DesktopIcon';
import { Window } from '@/components/desktop/Window';
import { Taskbar } from '@/components/desktop/Taskbar';
import { BootScreen } from '@/components/boot/BootScreen';
import { ShutdownScreen } from '@/components/shutdown/ShutdownScreen';
import { RestartScreen } from '@/components/restart/RestartScreen';
import { LoginScreen } from '@/components/login/LoginScreen';
import { useWindowManager } from '@/hooks/useWindowManager';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

// Define skill data structure
interface Skill {
  name: string;
  category: string;
  description: string;
  url: string;
}

// Define skill data (deduplicated and including all requested)
const skillsData: Skill[] = [
  // Programming Languages
  { name: 'Python', category: 'Languages', description: 'A versatile, high-level language known for its readability, used in web development, data science, AI, and scripting.', url: 'https://www.python.org/' },
  { name: 'Java', category: 'Languages', description: 'A robust, object-oriented language widely used for enterprise-scale applications, Android development, and large systems.', url: 'https://www.java.com/' },
  { name: 'C++', category: 'Languages', description: 'A powerful, high-performance language used for system software, game development, and applications requiring speed.', url: 'https://isocpp.org/' },
  { name: 'C', category: 'Languages', description: 'A foundational procedural language used for operating systems, embedded systems, and performance-critical applications.', url: 'https://en.wikipedia.org/wiki/C_(programming_language)' },
  { name: 'JavaScript', category: 'Languages', description: 'The core language of the web, enabling interactive and dynamic content on websites.', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
  { name: 'TypeScript', category: 'Languages', description: 'A superset of JavaScript that adds static types, improving code quality and maintainability for large projects.', url: 'https://www.typescriptlang.org/' },
  { name: 'Kotlin', category: 'Languages', description: 'A modern, concise language for JVM, Android, and browser development, officially supported by Google for Android.', url: 'https://kotlinlang.org/' },
  { name: 'PHP', category: 'Languages', description: 'A server-side scripting language widely used for web development, powering many popular CMS platforms.', url: 'https://www.php.net/' },

  // Frontend
  { name: 'React', category: 'Frontend', description: 'A popular JavaScript library developed by Facebook for building user interfaces based on components.', url: 'https://react.dev/' },
  { name: 'Vue.js', category: 'Frontend', description: 'A progressive JavaScript framework for building user interfaces, known for its approachability and performance.', url: 'https://vuejs.org/' },
  { name: 'HTML5', category: 'Frontend', description: 'The standard markup language for creating web pages and web applications.', url: 'https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5' },
  { name: 'CSS3', category: 'Frontend', description: 'The standard stylesheet language used for describing the presentation of a document written in HTML.', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },

   // Design
  { name: 'UI/UX Design', category: 'Design', description: 'Focuses on designing user interfaces and enhancing user satisfaction by improving usability and accessibility.', url: 'https://en.wikipedia.org/wiki/User_experience_design' },

  // Backend & Frameworks
  { name: 'Node.js', category: 'Backend', description: 'A JavaScript runtime built on Chrome\'s V8 engine, allowing developers to build scalable server-side applications.', url: 'https://nodejs.org/' },
  { name: 'Django', category: 'Backend', description: 'A high-level Python web framework that encourages rapid development and clean, pragmatic design.', url: 'https://www.djangoproject.com/' },
  { name: 'Flask', category: 'Backend', description: 'A lightweight WSGI web application framework in Python, designed to make getting started quick and easy.', url: 'https://flask.palletsprojects.com/' },
  { name: 'RabbitMQ', category: 'Backend', description: 'A popular open-source message broker that implements the Advanced Message Queuing Protocol (AMQP).', url: 'https://www.rabbitmq.com/' },

  // Cloud & DevOps
  { name: 'AWS', category: 'Cloud', description: 'Amazon Web Services: A comprehensive cloud computing platform offering a wide range of services.', url: 'https://aws.amazon.com/' },
  { name: 'Google Cloud', category: 'Cloud', description: 'Google Cloud Platform: A suite of cloud computing services offered by Google.', url: 'https://cloud.google.com/' },
  { name: 'Azure', category: 'Cloud', description: 'Microsoft Azure: A cloud computing service created by Microsoft for building, testing, deploying, and managing applications.', url: 'https://azure.microsoft.com/' },
  { name: 'Docker', category: 'DevOps', description: 'A platform for developing, shipping, and running applications in containers.', url: 'https://www.docker.com/' },
  { name: 'Kubernetes', category: 'DevOps', description: 'An open-source system for automating deployment, scaling, and management of containerized applications.', url: 'https://kubernetes.io/' },
  { name: 'Jenkins', category: 'DevOps', description: 'An open-source automation server used to automate parts of software development related to building, testing, and deploying (CI/CD).', url: 'https://www.jenkins.io/' },
  { name: 'Nginx', category: 'DevOps', description: 'A high-performance web server, reverse proxy, load balancer, and HTTP cache.', url: 'https://nginx.org/' },
  { name: 'Apache', category: 'DevOps', description: 'The Apache HTTP Server, a widely used open-source web server software.', url: 'https://httpd.apache.org/' },
  { name: 'Cloudflare', category: 'Cloud', description: 'A web infrastructure and website security company, providing CDN, DNS, DDoS protection and security services.', url: 'https://www.cloudflare.com/' },
  { name: 'Oracle', category: 'Cloud', description: 'Oracle Cloud Infrastructure (OCI): A cloud computing service offering compute, storage, networking, database, and platform services.', url: 'https://www.oracle.com/cloud/' },

  // Databases
  { name: 'MySQL', category: 'Databases', description: 'A widely used open-source relational database management system (RDBMS).', url: 'https://www.mysql.com/' },
  { name: 'Postgres', category: 'Databases', description: 'PostgreSQL: A powerful, open-source object-relational database system known for reliability and data integrity.', url: 'https://www.postgresql.org/' },
  { name: 'MongoDB', category: 'Databases', description: 'A popular NoSQL database program, using JSON-like documents with optional schemas.', url: 'https://www.mongodb.com/' },
  { name: 'Snowflake', category: 'Databases', description: 'A cloud-based data warehousing platform that provides data storage, processing, and analytic solutions.', url: 'https://www.snowflake.com/' },

  // Data Science & Tools
  { name: 'NumPy', category: 'Data Science', description: 'A fundamental package for scientific computing with Python, providing support for large, multi-dimensional arrays and matrices.', url: 'https://numpy.org/' },
  { name: 'Pandas', category: 'Data Science', description: 'A Python library providing high-performance, easy-to-use data structures and data analysis tools.', url: 'https://pandas.pydata.org/' },
  { name: 'TensorFlow', category: 'Data Science', description: 'An open-source library for machine learning and artificial intelligence, developed by Google.', url: 'https://www.tensorflow.org/' },

  // Version Control & Build Tools
  { name: 'Git', category: 'Tools', description: 'A distributed version control system designed to handle everything from small to very large projects with speed and efficiency.', url: 'https://git-scm.com/' },
  { name: 'Yarn', category: 'Tools', description: 'A package manager for JavaScript code, providing speed, security, and reliability.', url: 'https://yarnpkg.com/' },
  { name: 'Maven', category: 'Tools', description: 'A build automation tool used primarily for Java projects, managing dependencies and the build lifecycle.', url: 'https://maven.apache.org/' },
];


// Helper to group skills by category
const groupSkillsByCategory = (skills: Skill[]) => {
  return skills.reduce((acc, skill) => {
    const category = skill.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);
};

// Helper to get an icon for a skill category
const getSkillIcon = (category: string): LucideIcon => {
  switch (category) {
    case 'Languages': return Terminal;
    case 'Frontend': return MonitorSmartphone;
    case 'Backend': return Server;
    case 'Cloud': return Cloud;
    case 'DevOps': return Rocket;
    case 'Databases': return Database;
    case 'Data Science': return BrainCircuit;
    case 'Tools': return Wrench;
    case 'Design': return Paintbrush;
    default: return HelpCircle; // Default icon
  }
};


// Skills component content
const SkillsContent = () => {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const groupedSkills = groupSkillsByCategory(skillsData);
  const categories = Object.keys(groupedSkills).sort(); // Sort categories alphabetically

  // Get the icon for the selected skill
  const SelectedSkillIcon = selectedSkill ? getSkillIcon(selectedSkill.category) : null;


  return (
    // Use h-full on the outer div to ensure it takes up the available height of the window content area
    <div className="flex flex-col md:flex-row h-full p-1 gap-4">
      {/* Left Panel: Skill List - Ensure ScrollArea takes full height */}
      <ScrollArea className="w-full md:w-1/3 border-r pr-4 mb-4 md:mb-0 h-full"> {/* Added h-full */}
        <h2 className="text-xl font-semibold mb-3">Technical Skills</h2>
        {categories.map(category => (
          <div key={category} className="mb-4">
            <h3 className="font-medium mb-2 flex items-center gap-1.5">
              {React.createElement(getSkillIcon(category), { className: "w-4 h-4" })}
              {category}
            </h3>
            <div className="flex flex-wrap gap-1.5 pl-2">
              {groupedSkills[category].map(skill => (
                <Badge
                  key={skill.name}
                  variant={selectedSkill?.name === skill.name ? "default" : "secondary"}
                  className="cursor-pointer hover:bg-primary/10 transition-colors text-xs" // Made badge text smaller
                  onClick={() => setSelectedSkill(skill)}
                  aria-label={`Show details for ${skill.name}`}
                >
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </ScrollArea>

      {/* Right Panel: Skill Details - This panel should not scroll independently */}
      <div className="w-full md:w-2/3 flex flex-col items-center justify-start pt-4 md:pt-8"> {/* Adjusted padding */}
        {selectedSkill ? (
          <Card className="w-full max-w-md bg-transparent border-none shadow-none">
            {SelectedSkillIcon && (
              <div className="flex justify-center mb-4">
                 {/* Larger icon for the selected skill */}
                <SelectedSkillIcon className="w-12 h-12 md:w-16 md:h-16 text-primary opacity-80" /> {/* Slightly smaller icon on mobile */}
              </div>
            )}
            <CardHeader className="text-center p-0 mb-2"> {/* Reduced padding */}
              <CardTitle className="flex items-center justify-center gap-2 text-lg md:text-xl"> {/* Adjusted size */}
                <span>{selectedSkill.name}</span>
                 <a
                  href={selectedSkill.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                  title={`Visit ${selectedSkill.name} homepage`}
                >
                  <LinkIcon className="w-4 h-4 md:w-5 md:h-5" /> {/* Adjusted size */}
                </a>
              </CardTitle>
               <Badge variant="outline" className="mx-auto mt-1 text-xs">{selectedSkill.category}</Badge> {/* Center badge */}
            </CardHeader>
            <CardContent className="text-sm space-y-2 text-center px-2"> {/* Reduced padding and spacing */}

              <p className="text-muted-foreground">{selectedSkill.description}</p>
               {/* Add Link */}
               <a
                 href={selectedSkill.url}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="inline-flex items-center gap-1 text-primary underline hover:text-primary/80 text-xs"
               >
                 Learn more <LinkIcon className="w-3 h-3" />
               </a>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center text-muted-foreground flex flex-col items-center gap-2 pt-10 md:pt-16"> {/* Adjusted padding */}
             <Info className="w-10 h-10 md:w-12 md:h-12 opacity-40" /> {/* Adjusted size */}
            <p className="mt-2 text-sm md:text-base">Click on a skill to see details.</p> {/* Adjusted size */}
          </div>
        )}
      </div>
    </div>
  );
};


// Interface for icon position
interface IconPosition {
  x: number;
  y: number;
}

// Define initial window properties (without position info initially)
const initialWindowsConfig = {
  aboutMe: { // Renamed from myInfo
    id: 'aboutMe',
    title: 'About Me',
    icon: User,
    initialSize: { width: 600, height: 550 }, // Adjusted size
    content: (
      <ScrollArea className="h-full w-full p-1"> {/* Added ScrollArea here */}
        <div className="space-y-4 md:space-y-6"> {/* Removed p-1 from here */}
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="p-0 mb-2">
              <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2"> {/* Adjusted size */}
                <User className="w-5 h-5 md:w-6 md:h-6" /> About Me {/* Adjusted size */}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-sm">
              <p className="text-muted-foreground mb-4">
                Hello! I’m Krithiv Jayaprakash, a dedicated Computer Scientist driven by a passion for leveraging technology to create meaningful impact. My focus lies in developing innovative, scalable solutions that address real-world challenges. I’m committed to blending technical expertise with a forward-thinking mindset to shape the future of technology.
              </p>
            </CardContent>
          </Card>

          <Separator />

          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="p-0 mb-2 md:mb-3"> {/* Adjusted margin */}
              <CardTitle className="text-lg md:text-xl font-semibold flex items-center gap-2"> {/* Adjusted size */}
                <BarChart className="w-4 h-4 md:w-5 md:h-5" /> Core Strengths {/* Adjusted size */}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3 md:space-y-4 text-sm"> {/* Adjusted spacing */}
              <div className="flex items-start gap-2 md:gap-3"> {/* Adjusted gap */}
                <Cloud className="w-4 h-4 md:w-5 md:h-5 mt-0.5 md:mt-1 text-primary flex-shrink-0" /> {/* Adjusted size/margin */}
                <div>
                  <h4 className="font-semibold mb-1">Cloud Computing Expert</h4>
                  <span className="text-muted-foreground text-xs md:text-sm"> {/* Adjusted size */}
                    With deep experience in designing and implementing scalable cloud architectures, I specialize in optimizing cloud resources on platforms like <Badge variant="secondary" className="text-xs">AWS</Badge> and <Badge variant="secondary" className="text-xs">Google Cloud</Badge>. My approach ensures efficient, cost-effective solutions that meet the needs of dynamic businesses.
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2 md:gap-3"> {/* Adjusted gap */}
                <Terminal className="w-4 h-4 md:w-5 md:h-5 mt-0.5 md:mt-1 text-primary flex-shrink-0" /> {/* Adjusted size/margin */}
                <div>
                  <h4 className="font-semibold mb-1">Full Stack Development</h4>
                  <span className="text-muted-foreground text-xs md:text-sm"> {/* Adjusted size */}
                    Proficient across both frontend and backend technologies, I create seamless, user-centric applications that enhance digital experiences. My skill set spans <Badge variant="secondary" className="text-xs">React</Badge>, <Badge variant="secondary" className="text-xs">Node.js</Badge>, and <Badge variant="secondary" className="text-xs">Python</Badge>, allowing me to build robust, interactive solutions from the ground up.
                  </span>
                </div>
              </div>
               <div className="flex items-start gap-2 md:gap-3"> {/* Adjusted gap */}
                 <BrainCircuit className="w-4 h-4 md:w-5 md:h-5 mt-0.5 md:mt-1 text-primary flex-shrink-0" /> {/* Adjusted size/margin */}
                <div>
                  <h4 className="font-semibold mb-1">Analytical Problem Solver</h4>
                  <span className="text-muted-foreground text-xs md:text-sm"> {/* Adjusted size */}
                    Equipped with strong analytical skills, I thrive in breaking down complex problems into manageable parts and crafting innovative solutions that drive tangible results. Whether it’s optimizing cloud infrastructure or enhancing user interfaces, I approach every challenge with precision and creativity.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

           <Separator />

           <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="p-0 mb-2">
              <CardTitle className="text-lg md:text-xl font-semibold flex items-center gap-2"> {/* Adjusted size */}
                <Rocket className="w-4 h-4 md:w-5 md:h-5" /> Future Aspirations {/* Adjusted size */}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-sm">
              <p className="text-muted-foreground">
                My long-term goal is to return to India <MapPin className="inline w-3 h-3 md:w-4 md:h-4 mx-0.5 md:mx-1" /> and launch a technology startup that provides cutting-edge cloud infrastructure services to local businesses. By enabling enterprises to leverage advanced technologies, I aim to drive growth, foster innovation, and contribute to the digital transformation of the Indian economy.
              </p>
            </CardContent>
          </Card>

           <Separator />

          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="p-0 mb-2">
               <CardTitle className="text-lg md:text-xl font-semibold flex items-center gap-2"> {/* Adjusted size */}
                <Lightbulb className="w-4 h-4 md:w-5 md:h-5" /> Personal Interests {/* Adjusted size */}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-sm">
              <p className="text-muted-foreground">
                Outside of my academic and professional work, I’m an enthusiastic gamer <Gamepad2 className="inline w-3 h-3 md:w-4 md:h-4 mx-0.5 md:mx-1" /> and passionate tech enthusiast. I constantly explore the latest advancements in technology and enjoy being part of online communities centered around gaming and development. I also take pride in sharing my knowledge about cloud computing and software development, inspiring others to embrace technology and discover its endless possibilities.
              </p>
            </CardContent>
          </Card>
        </div>
      </ScrollArea> // Added ScrollArea closing tag
    ),
  },
  projects: {
    id: 'projects',
    title: 'Projects',
    icon: Briefcase,
    initialSize: { width: 650, height: 500 }, // Slightly larger for content
    content: (
      <ScrollArea className="h-full w-full p-1"> {/* Added ScrollArea here */}
        <div className="space-y-4 md:space-y-6"> {/* Removed p-1 from here */}
          <h2 className="text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2"> {/* Adjusted margin */}
             <Briefcase className="w-4 h-4 md:w-5 md:h-5" /> My Projects {/* Adjusted size */}
          </h2>

          <Card className="border-none shadow-none bg-transparent">
              <CardHeader className="p-0 mb-2">
                  <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2"> {/* Adjusted size */}
                      <Gamepad2 className="w-3 h-3 md:w-4 md:h-4 text-primary" /> MineVerse: Minecraft Server Management {/* Adjusted size */}
                  </CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-sm space-y-2 md:space-y-3 pl-4 md:pl-6"> {/* Adjusted spacing/padding */}
                   <div className="flex items-start gap-2 md:gap-3"> {/* Adjusted gap */}
                      <Target className="w-3 h-3 md:w-4 md:h-4 mt-0.5 text-primary flex-shrink-0" /> {/* Adjusted size */}
                      <div>
                          <h4 className="font-medium mb-0.5 md:mb-1">Objective</h4> {/* Adjusted margin */}
                          <p className="text-muted-foreground text-xs md:text-sm">Designed, developed, and managed a custom Minecraft server titled MineVerse, creating an engaging and collaborative online community for players.</p> {/* Adjusted size */}
                      </div>
                  </div>
                   <div className="flex items-start gap-2 md:gap-3"> {/* Adjusted gap */}
                      <Code className="w-3 h-3 md:w-4 md:h-4 mt-0.5 text-primary flex-shrink-0" /> {/* Adjusted size */}
                      <div>
                          <h4 className="font-medium mb-0.5 md:mb-1">Tech Stack</h4> {/* Adjusted margin */}
                           <p className="text-muted-foreground text-xs md:text-sm"> {/* Adjusted size */}
                               <Badge variant="secondary" className="text-xs">Java</Badge>, <Badge variant="secondary" className="text-xs">Linux Server Management</Badge>, <Badge variant="secondary" className="text-xs">MySQL</Badge> (for player data management), and <Badge variant="secondary" className="text-xs">Modding APIs</Badge>.
                          </p>
                      </div>
                  </div>
                  <div className="flex items-start gap-2 md:gap-3"> {/* Adjusted gap */}
                      <ListChecks className="w-3 h-3 md:w-4 md:h-4 mt-0.5 text-primary flex-shrink-0" /> {/* Adjusted size */}
                      <div>
                          <h4 className="font-medium mb-0.5 md:mb-1">Key Features</h4> {/* Adjusted margin */}
                          <p className="text-muted-foreground text-xs md:text-sm">Customized in-game mechanics, performance optimization, and security protocols to ensure a smooth, secure multiplayer experience.</p> {/* Adjusted size */}
                      </div>
                  </div>
                  <div className="flex items-start gap-2 md:gap-3"> {/* Adjusted gap */}
                       <Users className="w-3 h-3 md:w-4 md:h-4 mt-0.5 text-primary flex-shrink-0" /> {/* Adjusted size */}
                      <div>
                          <h4 className="font-medium mb-0.5 md:mb-1">Community Engagement</h4> {/* Adjusted margin */}
                          <p className="text-muted-foreground text-xs md:text-sm">Established a thriving player community through regular events, contests, and challenges, fostering a sense of teamwork, creativity, and collaboration.</p> {/* Adjusted size */}
                      </div>
                  </div>
              </CardContent>
          </Card>

          {/* You can add more projects here following the same Card structure */}
          {/*
          <Separator />
          <Card className="border-none shadow-none bg-transparent">
              <CardHeader>...</CardHeader>
              <CardContent>...</CardContent>
          </Card>
          */}
        </div>
      </ScrollArea> // Added ScrollArea closing tag
    ),
  },
  skills: {
    id: 'skills',
    title: 'Skills',
    icon: Brain,
    initialSize: { width: 700, height: 500 }, // Adjusted size for two panels
    // SkillsContent now manages its own layout and scrolling internally
    content: <SkillsContent />,
  },
   education: { // Added Education
    id: 'education',
    title: 'Education',
    icon: GraduationCap,
    initialSize: { width: 600, height: 450 }, // Increased height
    content: (
       <ScrollArea className="h-full w-full p-1"> {/* Added ScrollArea here */}
         <div className="space-y-4 md:space-y-6"> {/* Removed p-1 from here */}
          <h2 className="text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2"> {/* Adjusted margin */}
            <GraduationCap className="w-4 h-4 md:w-5 md:h-5" /> Education {/* Adjusted size */}
          </h2>

          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="p-0 mb-1 md:mb-2"> {/* Adjusted margin */}
              <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2"> {/* Adjusted size */}
                 <Building className="w-3 h-3 md:w-4 md:h-4 text-primary" /> Massachusetts Institute of Technology (MIT) {/* Adjusted size */}
              </CardTitle>
               <p className="text-xs md:text-sm text-muted-foreground pl-4 md:pl-6">The MIT Schwarzman College of Computing</p> {/* Adjusted size/padding */}
            </CardHeader>
            <CardContent className="p-0 text-sm space-y-1 pl-4 md:pl-6"> {/* Adjusted padding */}
               <p><strong>Degree:</strong> Postgraduate Degree in Cyber Security</p>
              <p className="text-muted-foreground mt-1 text-xs md:text-sm"> {/* Adjusted size */}
                  <strong>Highlights:</strong> Specialized in cybersecurity frameworks, threat detection, and network security. Covered advanced topics such as ethical hacking, cryptography, and cyber defense strategies for enterprise and cloud environments.
              </p>
            </CardContent>
          </Card>

          <Separator />

           <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="p-0 mb-1 md:mb-2"> {/* Adjusted margin */}
              <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2"> {/* Adjusted size */}
                 <University className="w-3 h-3 md:w-4 md:h-4 text-primary" /> Chandigarh University {/* Adjusted size */}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-sm space-y-1 pl-4 md:pl-6"> {/* Adjusted padding */}
               <p><strong>Degree:</strong> Bachelor of Computer Applications (BCA)</p>
               <p><strong>Graduation:</strong> Completed with a CGPA of 7.69</p>
              <p className="text-muted-foreground mt-1 text-xs md:text-sm"> {/* Adjusted size */}
                 <strong>Highlights:</strong> Built a strong foundation in software development, database management, and cloud computing, with practical projects showcasing the application of theoretical knowledge.
              </p>
            </CardContent>
          </Card>
        </div>
      </ScrollArea> // Added ScrollArea closing tag
    ),
  },
  certifications: {
    id: 'certifications',
    title: 'Certifications',
    icon: Award,
    initialSize: { width: 600, height: 500 }, // Adjusted size
    content: (
       <ScrollArea className="h-full w-full p-1"> {/* Added ScrollArea here */}
         <div className="space-y-4 md:space-y-6"> {/* Removed p-1 from here */}
          <h2 className="text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2"> {/* Adjusted margin */}
              <Award className="w-4 h-4 md:w-5 md:h-5" /> Certifications & Awards {/* Adjusted size */}
          </h2>

          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="p-0 mb-1 md:mb-2"> {/* Adjusted margin */}
              <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2"> {/* Adjusted size */}
                 <ShieldCheck className="w-3 h-3 md:w-4 md:h-4 text-primary" /> Certified Ethical Hacker (CEH) v12 {/* Adjusted size */}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-sm space-y-1 pl-4 md:pl-6"> {/* Adjusted padding */}
               <p><strong>Institution:</strong> EC-Council</p>
               <p><strong>Course Date:</strong> May 13, 2023</p>
               <p><strong>Certificate Number:</strong> 674505</p>
              <p className="text-muted-foreground mt-1 text-xs md:text-sm"> {/* Adjusted size */}
                  Expertise in ethical hacking, including penetration testing, vulnerability assessment, and offensive security practices.
              </p>
            </CardContent>
          </Card>

          <Separator />

           <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="p-0 mb-1 md:mb-2"> {/* Adjusted margin */}
              <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2"> {/* Adjusted size */}
                 <ShieldCheck className="w-3 h-3 md:w-4 md:h-4 text-primary" /> Cyber Security Expert Certification {/* Adjusted size */}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-sm space-y-1 pl-4 md:pl-6"> {/* Adjusted padding */}
              <p><strong>Institution:</strong> Simplilearn</p>
              <p><strong>Issued:</strong> September 2023</p>
              <p><strong>Credential ID:</strong> 81614180</p>
              <p className="text-muted-foreground mt-1 text-xs md:text-sm"> {/* Adjusted size */}
                Mastered skills in cybersecurity, covering topics like network security, incident response, and vulnerability management.
              </p>
            </CardContent>
          </Card>

          <Separator />

          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="p-0 mb-1 md:mb-2"> {/* Adjusted margin */}
              <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2"> {/* Adjusted size */}
                <ShieldCheck className="w-3 h-3 md:w-4 md:h-4 text-primary" /> Cyber Security Certification {/* Adjusted size */}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-sm space-y-1 pl-4 md:pl-6"> {/* Adjusted padding */}
              <p><strong>Institution:</strong> 1Stop.ai</p>
              <p><strong>Issued:</strong> August 2024</p>
              <p><strong>Credential ID:</strong> RHzNiPTgT0</p>
              <p className="text-muted-foreground mt-1 text-xs md:text-sm"> {/* Adjusted size */}
                Comprehensive training in threat detection, network security, and cyber defense strategies, with a focus on ethical hacking and vulnerability assessment.
              </p>
            </CardContent>
          </Card>

          {/* Example for Awards (if any) */}
          {/*
          <Separator />
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="p-0 mb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                 <Award className="w-4 h-4 text-primary" /> Award/Recognition
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-sm pl-6">
              <p>Details about any relevant awards or honors received.</p>
            </CardContent>
          </Card>
          */}
        </div>
      </ScrollArea> // Added ScrollArea closing tag
    ),
  },
   blog: { // Added Blog
    id: 'blog',
    title: 'Blog',
    icon: Newspaper,
    initialSize: { width: 550, height: 550 }, // Increased height
    content: (
       <ScrollArea className="h-full w-full p-1"> {/* Added ScrollArea here */}
         <div className="space-y-4 md:space-y-6"> {/* Removed p-1 from here */}
          <h2 className="text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2"> {/* Adjusted margin */}
            <Newspaper className="w-4 h-4 md:w-5 md:h-5" /> My Journey & Insights {/* Adjusted size */}
          </h2>

          <p className="text-sm text-muted-foreground">
            I explore the fascinating journey of transitioning from a Bachelor of Computer Applications (BCA) to a Bachelor of Science in Computer Science (BS) at South Dakota State University. Here, I’ll share a rich blend of personal experiences, insights, and the challenges I’ve encountered along the way.
          </p>

          <Separator />

          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="p-0 mb-1 md:mb-2"> {/* Adjusted margin */}
              <CardTitle className="text-base md:text-lg font-semibold">What to Expect</CardTitle> {/* Adjusted size */}
            </CardHeader>
            <CardContent className="p-0 text-sm space-y-2 md:space-y-3 text-muted-foreground"> {/* Adjusted spacing */}
              <div className="flex items-start gap-2 md:gap-3"> {/* Adjusted gap */}
                 <Lightbulb className="w-3 h-3 md:w-4 md:h-4 mt-1 text-primary flex-shrink-0" /> {/* Adjusted size */}
                <div>
                  <h4 className="font-medium text-foreground mb-0.5 md:mb-1">Effective Study Techniques</h4> {/* Adjusted margin */}
                  <p className="text-xs md:text-sm">Discover strategies that have helped me excel academically, from time management to resource utilization.</p> {/* Adjusted size */}
                </div>
              </div>
               <div className="flex items-start gap-2 md:gap-3"> {/* Adjusted gap */}
                 <Briefcase className="w-3 h-3 md:w-4 md:h-4 mt-1 text-primary flex-shrink-0" /> {/* Adjusted size */}
                <div>
                  <h4 className="font-medium text-foreground mb-0.5 md:mb-1">Project Highlights</h4> {/* Adjusted margin */}
                  <p className="text-xs md:text-sm">Get a behind-the-scenes look at the projects I've worked on, detailing the technologies used, lessons learned, and the impact made.</p> {/* Adjusted size */}
                </div>
              </div>
               <div className="flex items-start gap-2 md:gap-3"> {/* Adjusted gap */}
                 <Rocket className="w-3 h-3 md:w-4 md:h-4 mt-1 text-primary flex-shrink-0" /> {/* Adjusted size */}
                <div>
                  <h4 className="font-medium text-foreground mb-0.5 md:mb-1">Hackathon Tips</h4> {/* Adjusted margin */}
                  <p className="text-xs md:text-sm">As a passionate participant in hackathons, I’ll provide actionable tips and advice for aspiring developers, sharing how to make the most of these collaborative experiences.</p> {/* Adjusted size */}
                </div>
              </div>
               <div className="flex items-start gap-2 md:gap-3"> {/* Adjusted gap */}
                <Terminal className="w-3 h-3 md:w-4 md:h-4 mt-1 text-primary flex-shrink-0" /> {/* Adjusted size */}
                <div>
                  <h4 className="font-medium text-foreground mb-0.5 md:mb-1">Trending Topics</h4> {/* Adjusted margin */}
                  <p className="text-xs md:text-sm">Stay updated with my takes on the latest trends in cloud computing, programming best practices, and emerging technologies that are shaping the future of our industry.</p> {/* Adjusted size */}
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

           <p className="text-sm text-muted-foreground">
             Join me on this journey as I navigate through my academic and professional growth. I’m excited to share my insights and learn from the community, fostering a space where we can all grow together. Keep an eye out for upcoming posts that aim to inspire and empower fellow tech enthusiasts!
          </p>

           <div className="flex justify-center pt-2 md:pt-4"> {/* Adjusted padding */}
             <Button asChild size="sm" className="text-xs md:text-sm">
              <a href="https://blog.krithiv.work" target="_blank" rel="noopener noreferrer">
                {/* Wrap content in a span to fix hydration error */}
                <span>
                  View Blog <LinkIcon className="ml-1 md:ml-2 w-3 h-3 md:w-4 md:h-4 inline" />
                </span>
              </a>
            </Button>
          </div>
        </div>
      </ScrollArea> // Added ScrollArea closing tag
    ),
  },
   contact: { // Added Contact
    id: 'contact',
    title: 'Contact',
    icon: Mail,
    initialSize: { width: 550, height: 500 }, // Adjusted size for more links
    content: (
       <ScrollArea className="h-full w-full p-1"> {/* Added ScrollArea here */}
         <div className="space-y-4 md:space-y-6"> {/* Removed p-1 from here */}
           <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
             <Mail className="w-4 h-4 md:w-5 md:h-5" /> Contact Information {/* Adjusted size */}
          </h2>
          <p className="text-sm text-muted-foreground">
            Let’s connect! I’m always excited to engage with like-minded individuals, share ideas, and explore new opportunities in the tech world.
          </p>

          <Card className="border-none shadow-none bg-transparent">
              <CardHeader className="p-0 mb-1 md:mb-2"> {/* Adjusted margin */}
                  <CardTitle className="text-base md:text-lg font-medium">Get in Touch</CardTitle> {/* Adjusted size */}
              </CardHeader>
              <CardContent className="p-0 text-sm space-y-2 md:space-y-3"> {/* Adjusted spacing */}
                  <div className="flex items-center gap-2 md:gap-3"> {/* Adjusted gap */}
                  <Mail className="w-3 h-3 md:w-4 md:h-4 text-primary flex-shrink-0" /> {/* Adjusted size */}
                  <div>
                      <h4 className="font-semibold text-xs md:text-sm">Email</h4> {/* Adjusted size */}
                      <a href="mailto:me@krithiv.work" className="text-primary underline hover:text-primary/80 text-xs md:text-sm">me@krithiv.work</a> {/* Adjusted size */}
                  </div>
                  </div>
              </CardContent>
          </Card>

           <Separator />

          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="p-0 mb-1 md:mb-2"> {/* Adjusted margin */}
              <CardTitle className="text-base md:text-lg font-medium">Social & Professional</CardTitle> {/* Adjusted size */}
            </CardHeader>
            <CardContent className="p-0 text-sm space-y-2 md:space-y-3"> {/* Adjusted spacing */}
              <div className="flex items-center gap-2 md:gap-3"> {/* Adjusted gap */}
                  <Instagram className="w-3 h-3 md:w-4 md:h-4 text-primary flex-shrink-0" /> {/* Adjusted size */}
                  <div>
                      <h4 className="font-semibold text-xs md:text-sm">Instagram</h4> {/* Adjusted size */}
                      <a href="https://www.instagram.com/krithiv_7" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 mr-2 md:mr-4 text-xs md:text-sm"> {/* Adjusted margin/size */}
                          krithiv_7 <span className="text-xs text-muted-foreground">(personal)</span>
                      </a>
                       <a href="https://www.instagram.com/krithiv.work" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 text-xs md:text-sm"> {/* Adjusted size */}
                          krithiv.work <span className="text-xs text-muted-foreground">(work)</span>
                      </a>
                  </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3"> {/* Adjusted gap */}
                  <Linkedin className="w-3 h-3 md:w-4 md:h-4 text-primary flex-shrink-0" /> {/* Adjusted size */}
                  <div>
                    <h4 className="font-semibold text-xs md:text-sm">LinkedIn</h4> {/* Adjusted size */}
                    <a href="https://linkedin.com/in/krithiv" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 text-xs md:text-sm">linkedin.com/in/krithiv</a> {/* Adjusted size */}
                  </div>
              </div>
               <div className="flex items-center gap-2 md:gap-3"> {/* Adjusted gap */}
                   <Github className="w-3 h-3 md:w-4 md:h-4 text-primary flex-shrink-0" /> {/* Adjusted size */}
                   <div>
                     <h4 className="font-semibold text-xs md:text-sm">GitHub</h4> {/* Adjusted size */}
                     <a href="https://github.com/Krithiv-7" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 text-xs md:text-sm">github.com/Krithiv-7</a> {/* Adjusted size */}
                   </div>
               </div>
               <div className="flex items-center gap-2 md:gap-3"> {/* Adjusted gap */}
                  <Twitter className="w-3 h-3 md:w-4 md:h-4 text-primary flex-shrink-0" /> {/* Adjusted size */}
                   <div>
                     <h4 className="font-semibold text-xs md:text-sm">Twitter / X</h4> {/* Adjusted size */}
                     <a href="https://twitter.com/krithiv_7" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 text-xs md:text-sm">@krithiv_7</a> {/* Adjusted size */}
                   </div>
               </div>
               <div className="flex items-center gap-2 md:gap-3"> {/* Adjusted gap */}
                  {/* Using LinkIcon as a generic placeholder for Reddit */}
                   <LinkIcon className="w-3 h-3 md:w-4 md:h-4 text-primary flex-shrink-0" /> {/* Adjusted size */}
                   <div>
                     <h4 className="font-semibold text-xs md:text-sm">Reddit</h4> {/* Adjusted size */}
                     <a href="https://reddit.com/user/krithiv_7" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 text-xs md:text-sm">u/krithiv_7</a> {/* Adjusted size */}
                   </div>
               </div>
                <div className="flex items-center gap-2 md:gap-3"> {/* Adjusted gap */}
                   {/* Using LinkIcon as a generic placeholder for Modrinth */}
                   <LinkIcon className="w-3 h-3 md:w-4 md:h-4 text-primary flex-shrink-0" /> {/* Adjusted size */}
                   <div>
                     <h4 className="font-semibold text-xs md:text-sm">Modrinth</h4> {/* Adjusted size */}
                     <a href="https://modrinth.com/user/krithiv_7" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 text-xs md:text-sm">modrinth.com/user/krithiv_7</a> {/* Adjusted size */}
                   </div>
               </div>
            </CardContent>
          </Card>

           <Separator />

           <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="p-0 mb-1 md:mb-2"> {/* Adjusted margin */}
              <CardTitle className="text-base md:text-lg font-medium">Support My Work</CardTitle> {/* Adjusted size */}
            </CardHeader>
            <CardContent className="p-0 text-sm space-y-2 md:space-y-3"> {/* Adjusted spacing */}
               <div className="flex items-center gap-2 md:gap-3"> {/* Adjusted gap */}
                  <DollarSign className="w-3 h-3 md:w-4 md:h-4 text-primary flex-shrink-0" /> {/* Adjusted size */}
                  <div>
                    <h4 className="font-semibold text-xs md:text-sm">PayPal</h4> {/* Adjusted size */}
                    <a href="https://paypal.me/krithiv" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 text-xs md:text-sm">paypal.me/krithiv</a> {/* Adjusted size */}
                  </div>
              </div>
               <div className="flex items-center gap-2 md:gap-3"> {/* Adjusted gap */}
                  <Coffee className="w-3 h-3 md:w-4 md:h-4 text-primary flex-shrink-0" /> {/* Adjusted size */}
                  <div>
                    <h4 className="font-semibold text-xs md:text-sm">Ko-fi</h4> {/* Adjusted size */}
                    <a href="https://ko-fi.com/krithiv" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 text-xs md:text-sm">ko-fi.com/krithiv</a> {/* Adjusted size */}
                  </div>
              </div>
            </CardContent>
          </Card>


          <Separator />

          <p className="text-sm text-muted-foreground">
            Feel free to reach out for collaboration, inquiries, or just to share your thoughts on technology and innovation. I look forward to connecting with you!
          </p>
        </div>
      </ScrollArea> // Added ScrollArea closing tag
    ),
  },
};

// --- Database Icon Component (Placeholder) --- - Already imported from lucide-react

// --- Main Desktop Component ---
export default function DesktopFolio() {
  const [appState, setAppState] = useState<'booting' | 'login' | 'desktop' | 'shuttingDown' | 'restarting'>('booting');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track login status

  // State for desktop icon positions
  const [desktopIcons, setDesktopIcons] = useState<Record<string, IconPosition>>({});
  // State for tracking the currently dragged icon
  const [draggingIconId, setDraggingIconId] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const desktopRef = useRef<HTMLDivElement>(null); // Ref for the desktop area
  const [isMobile, setIsMobile] = useState(false); // State to track mobile view

  // Detect mobile view on mount and resize
   useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768); // Example breakpoint for mobile
    checkMobile(); // Check on initial mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize icon positions on mount and when switching to/from mobile
  useEffect(() => {
    const initialPositions: Record<string, IconPosition> = {};
    const iconWidth = isMobile ? 70 : 110; // Smaller spacing on mobile
    const iconHeight = isMobile ? 80 : 110; // Smaller spacing on mobile
    const padding = 16;
    const desktopWidth = desktopRef.current?.clientWidth || window.innerWidth;
    const iconsPerRow = Math.max(1, Math.floor((desktopWidth - padding * 2) / iconWidth)); // Ensure at least 1 icon per row

    Object.keys(initialWindowsConfig).forEach((id, index) => {
      const col = index % iconsPerRow;
      const row = Math.floor(index / iconsPerRow);
      initialPositions[id] = { x: col * iconWidth + padding, y: row * iconHeight + padding };
    });
    setDesktopIcons(initialPositions);
  }, [isMobile]); // Re-initialize when isMobile changes


  const {
    windows,
    activeWindowId,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    handleFocus,
    handleTaskbarClick,
    toggleMinimizeAll,
    resetWindows, // Add reset function from hook
  } = useWindowManager(initialWindowsConfig);

  const [wallpaperUrl, setWallpaperUrl] = useState<string | null>(null);
  const [isLoadingWallpaper, setIsLoadingWallpaper] = useState(true);

  useEffect(() => {
    // Fetch wallpaper only on the client-side
    const fetchWallpaper = () => {
      if (typeof window === 'undefined') return; // Ensure runs only on client

      setIsLoadingWallpaper(true);
      const width = window.innerWidth;
      const height = window.innerHeight;
      // Switch to Picsum Photos, add timestamp to try and avoid caching issues
      const url = `https://picsum.photos/${width}/${height}?t=${Date.now()}`;
      const img = new Image();
      img.onload = () => {
        setWallpaperUrl(url);
        setIsLoadingWallpaper(false);
      };
      img.onerror = (e) => {
        console.error("Failed to load wallpaper", e);
        // Maybe set a fallback solid color or default image?
         setWallpaperUrl(null); // Set to null or a fallback URL
        setIsLoadingWallpaper(false);
      }
      img.src = url;
    };

    fetchWallpaper();

  }, []); // Empty dependency array ensures this runs once on mount

  const handleBootComplete = () => {
    setAppState('login'); // Go to login screen after boot
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setAppState('desktop'); // Go to desktop after successful login
  };

   const handleShutdownClick = () => {
    setAppState('shuttingDown');
  };

   const handleRestartClick = () => {
     setAppState('restarting');
   };

  const handleShutdownComplete = () => {
    if (typeof window !== 'undefined') {
       // Redirect to a blank page instead of google.com for a cleaner shutdown effect
      window.location.href = 'about:blank';
    }
  };

  const handleRestartComplete = () => {
    // Reset necessary states for a clean restart
    setIsAuthenticated(false);
    resetWindows(); // Reset window states
    setAppState('booting'); // Start the boot sequence again
  };


  const desktopStyle = wallpaperUrl
    ? { backgroundImage: `url(${wallpaperUrl})` }
    : { backgroundColor: 'hsl(var(--background))' }; // Fallback bg color


  // --- Icon Drag Handlers ---
   const handleIconMouseDown = (e: React.MouseEvent | React.TouchEvent, id: string) => {
    const isTouchEvent = 'touches' in e;
    if (!isTouchEvent && (e as React.MouseEvent).button !== 0) return; // Only left click for mouse

    const target = e.target as HTMLElement;
    const iconElement = target.closest('[data-icon-id]');
    if (!iconElement || !desktopRef.current) return;

    setDraggingIconId(id);
    const iconRect = iconElement.getBoundingClientRect();
    const desktopRect = desktopRef.current.getBoundingClientRect();
    const clientX = isTouchEvent ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = isTouchEvent ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;


    dragOffset.current = {
      x: clientX - iconRect.left + desktopRect.left, // Adjust for desktop position
      y: clientY - iconRect.top + desktopRect.top,   // Adjust for desktop position
    };

    if (isTouchEvent) {
        document.addEventListener('touchmove', handleIconMouseMove as unknown as EventListener);
        document.addEventListener('touchend', handleIconMouseUp as unknown as EventListener);
    } else {
        document.addEventListener('mousemove', handleIconMouseMove);
        document.addEventListener('mouseup', handleIconMouseUp);
    }

    e.preventDefault(); // Prevent text selection and default touch behaviors
  };

  const handleIconMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!draggingIconId || !desktopRef.current) return;

    const isTouchEvent = 'touches' in e;
    const clientX = isTouchEvent ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = isTouchEvent ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;


    const desktopRect = desktopRef.current.getBoundingClientRect();
    const taskbarHeight = 40; // Adjust if your taskbar height is different

    // Calculate potential new position relative to the viewport, then adjust for desktopRect offset
    let newX = clientX - dragOffset.current.x;
    let newY = clientY - dragOffset.current.y;

    // Boundary checks (keep icon within desktop bounds, accounting for taskbar and desktop offset)
     const iconWidth = isMobile ? 70 : 96; // Use dynamic icon width
     const iconHeight = isMobile ? 80 : 96; // Use dynamic icon height

    // Ensure the icon stays within the desktopRef boundaries
    newX = Math.max(0, Math.min(desktopRect.width - iconWidth, newX));
    newY = Math.max(0, Math.min(desktopRect.height - iconHeight - taskbarHeight, newY));

    setDesktopIcons((prev) => ({
      ...prev,
      [draggingIconId]: { x: newX, y: newY },
    }));
  };

  const handleIconMouseUp = (e: MouseEvent | TouchEvent) => {
    if (!draggingIconId) return;
    setDraggingIconId(null);

     const isTouchEvent = 'touches' in e;
     if (isTouchEvent) {
         document.removeEventListener('touchmove', handleIconMouseMove as unknown as EventListener);
         document.removeEventListener('touchend', handleIconMouseUp as unknown as EventListener);
     } else {
        document.removeEventListener('mousemove', handleIconMouseMove);
        document.removeEventListener('mouseup', handleIconMouseUp);
    }
  };
  // --- End Icon Drag Handlers ---


  // Render based on appState
  if (appState === 'booting') {
    return <BootScreen onComplete={handleBootComplete} />;
  }

  if (appState === 'login') {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} wallpaperUrl={wallpaperUrl} />;
  }

  if (appState === 'shuttingDown') {
    return <ShutdownScreen onComplete={handleShutdownComplete} />;
  }

   if (appState === 'restarting') {
    return <RestartScreen onComplete={handleRestartComplete} />;
  }


  // Render the main desktop UI only if authenticated and in 'desktop' state
  if (appState === 'desktop' && isAuthenticated) {
    return (
      <div
          ref={desktopRef} // Add ref to the main desktop container
          className={cn(
          "relative h-screen w-screen overflow-hidden bg-background bg-cover bg-center transition-colors duration-500",
          isLoadingWallpaper ? 'bg-gray-700 animate-pulse' : '' // Add pulse on loading
          )}
           style={desktopStyle}
           data-ai-hint="desktop background abstract nature"
      >
        {/* Desktop Area - Icons are absolutely positioned */}
        {/* Adjusted padding and bottom offset for mobile */}
        <div className="absolute inset-0 bottom-10 p-2 md:p-4 overflow-hidden">
          {Object.entries(desktopIcons).map(([id, pos]) => {
            const winConfig = initialWindowsConfig[id as keyof typeof initialWindowsConfig];
            if (!winConfig) return null; // Skip if config not found

            return (
                <DesktopIcon
                  key={id}
                  id={id} // Pass id for drag identification
                  icon={winConfig.icon || Folder}
                  label={winConfig.title}
                  onClick={() => openWindow(winConfig.id)}
                  // Adjust icon size and text for mobile
                   className={cn(
                    "text-white text-shadow-md absolute",
                     isMobile ? "w-[70px] h-[80px] text-[10px]" : "w-24 h-24 text-sm" // Apply conditional sizing
                   )}
                  style={{ left: `${pos.x}px`, top: `${pos.y}px` }} // Apply position from state
                  onMouseDown={(e) => handleIconMouseDown(e, id)} // Attach mouse down handler
                  onTouchStart={(e) => handleIconMouseDown(e, id)} // Attach touch start handler
                  isDragging={draggingIconId === id} // Pass dragging state
                />
            );
          })}
        </div>


        {/* Windows Area */}
        <div className="absolute inset-0 bottom-10 overflow-hidden pointer-events-none">
          {Object.values(windows).map((win) => {
             // Determine initial position: use saved position if available, else fallback
             const windowInitialPos = win.initialPosition || { x: 100, y: 100 }; // Provide a default fallback
            return (
                <div key={win.id} className="pointer-events-auto">
                <Window
                    id={win.id}
                    title={win.title}
                    initialPosition={windowInitialPos} // Use determined initial pos
                    initialSize={win.initialSize}
                    isOpen={win.isOpen}
                    isMinimized={win.isMinimized}
                    isMaximized={win.isMaximized}
                    zIndex={win.zIndex}
                    onClose={closeWindow}
                    onMinimize={() => minimizeWindow(win.id)} // Pass only ID
                    onMaximize={() => maximizeWindow(win.id)} // Pass only ID
                    onFocus={handleFocus}
                    isMobile={isMobile} // Pass isMobile prop
                >
                     {/* Render the content for the specific window */}
                     {initialWindowsConfig[win.id as keyof typeof initialWindowsConfig]?.content ?? <div>Content not found</div>}
                </Window>
                </div>
            );
          })}
        </div>


        {/* Taskbar */}
        <Taskbar
          windows={windows}
          onTaskbarClick={handleTaskbarClick}
          activeWindowId={activeWindowId}
          onHomeClick={toggleMinimizeAll}
          onShutdownClick={handleShutdownClick}
          onRestartClick={handleRestartClick}
          isMobile={isMobile} // Pass isMobile prop
        />
      </div>
    );
  }

   // Fallback case (should ideally not be reached if logic is correct)
   return <div className="fixed inset-0 flex items-center justify-center bg-black text-white">Loading Deskfolio...</div>;
}
