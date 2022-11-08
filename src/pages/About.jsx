import React, { useState, useEffect } from 'react';
import '../App.css';

import Arguments from '../components/Arguments';
import Command from '../components/Command';
import Link from "../components/Link";

const About = () => {
  const args = [{
    required: true,
    name: 'name',
    type: <span className="text-yellow">TEXT</span>,
    description: 'The persons name.',
    defaults: 'Brook Jeynes',
    colour: false
  }];

  const options = [
    {
      required: false,
      name: '--summary',
      type: 'OBJECT',
      description: 'A short summary of the person.',
      defaults: '{ name: "Brook Jeynes", age: 19, location: "Brisbane, Australia" }',
    },
    {
      required: false,
      name: '--current-job',
      type: 'TEXT',
      description: 'The users current job.',
      defaults: <Link link="https://www.ssw.com.au/people/brook-jeynes" text="SSW - Software Developer" />,
    },
    {
      required: false,
      name: '--education',
      type: 'TEXT',
      description: 'The users education.',
      defaults: 'Queensland University of Technology - Currently Studying',
    },
    {
      required: false,
      name: '--skills',
      type: 'LIST',
      description: 'The users skills.',
      defaults: '[ JS, React, Python, C, C#, .NET ]',
    },
    {
      required: false,
      name: '--interests',
      type: 'LIST',
      description: 'The users interests.',
      defaults: '[ programming, micro-controllers, gaming, music ]',
    },
    {
      required: false,
      name: '--links',
      type: 'LIST',
      description: 'The users social links.',
      defaults: 
        <span>[ <Link link="https://www.linkedin.com/in/brook-jeynes/" text="LinkedIn" />, <Link link="https://github.com/BrookJeynes" text="Github" />, <Link link="mailto:jeynesbrook@pm.me" text="Email" /> ]</span>,
    },
    {
      required: false,
      name: '--help',
      type: '',
      description: 'Show this message and exit',
      defaults: '',
    },
  ];

  return (
    <div className="page-container">
      <div className="about-container">
        <Command tag='p' command='about-me --help' blink={false} />
        
        <p className="mt-7 mb-4"><span><span className="text-yellow">Usage:</span> about-me [OPTIONS] NAME</span></p>

        <fieldset className="title-border arguments">
          <legend>Arguments</legend>
          <Arguments {...args[0]} /> 
        </fieldset> 

        <fieldset className="title-border options" style={{marginBottom: 70}}>
          <legend>Options</legend>
          {options.map((option, index) => (
            <Arguments key={index} {...option} />
          ))}
        </fieldset>

        <Command tag='p' command='about-me --summary "Brook Jeynes"' blink={false} />

        <div className="about-me-response">
            <p>
              <span style={{fontWeight: 'bold'}}>Hey, I'm Brook!</span> <br /> <br />
              I'm a <span className="text-yellow">19</span> year old <span className="text-yellow">Software Developer</span> from <span className="text-yellow">Brisbane, Australia</span>. <br />
              I'm currently in my second year of studying <span className="text-yellow">Computer Science</span> at <span className="text-yellow">Queensland University of Technology (QUT)</span>. <br />
              While studying I'm also working as a <span className="text-yellow">Software Developer</span> at <Link link="https://www.ssw.com.au/people/brook-jeynes" text="SSW" /> creating lots of cool products for companies using technologies such as <span className="text-yellow">React</span>, <span className="text-yellow">ASP.NET</span>, <span className="text-yellow">C#</span>, and many more. <br /> <br />
              In my spare time I like to do a variety of things such as:
              <ul>
                <li>Programming (obviously)</li>
                <li>Working on many personal projects such as this website</li>
                <li>Playing Tabletop and Video Games with friends</li>
                <li>Writing, singing and playing music on guitar and piano</li>
                <li>Learning about Micro-controllers and Electronics</li>
              </ul>
              I hope you enjoyed learning a bit more about me!
            </p>
        </div>

        <Command tag='p' command='about-me --current-job "Brook Jeynes"' blink={false} />

        <div className="about-me-response">
            <p>
              
            </p>
        </div>

        <Command tag='p' command='about-me --education "Brook Jeynes"' blink={false} />

        <div className="about-me-response">
            <p>
              I'm currently in my second year of studying <span className="text-yellow">Information Technology</span> at <span className="text-yellow">Queensland University of Technology (QUT)</span>. <br />
              I'm majoring in <span className="text-yellow">Computer Science</span> while minoring in <span className="text-yellow">IoT and Mobile Technologies</span> and <span className="text-yellow">Data-Centric Computing Extension</span>. <br /> <br />
            </p>
        </div>

        <Command tag='p' command='about-me --skills "Brook Jeynes"' blink={false} />

        <div className="about-me-response">
            <p>
              I've had exposure to a variety of programming languages and technologies such as:
              <ul className="list-disc list-inside">
                <li>C# (ASP.NET, Entity Framework)</li>
                <li>JavaScript/Typescript (React, Node.js, Express, Bootstrap, HTML, CSS)</li>
                <li>Python (Flask, Tkinter)</li>
                <li>Java</li>
                <li>C</li>
                <li>Git</li>
                <li>Azure</li>
                <li>Linux, Windows and MacOS</li>
              </ul>
            </p>
        </div>

        <Command tag='p' command='about-me --interests "Brook Jeynes"' blink={false} />

        <div className="about-me-response">
            <p>
              
            </p>
        </div>

        <Command tag='p' command='about-me --links "Brook Jeynes"' blink={false} />

        <div className="about-me-response">
            <p>
              You can find me on a variety of platforms such as:
              <ul className="mt-5">
                <li>linkedin - <Link link="https://www.linkedin.com/in/brook-jeynes/" text="linkedin/brook-jeynes" /></li>
                <li>github - <Link link="https://github.com/BrookJeynes" text="github/brookjeynes" /></li>
                <li>email - <Link link="mailto:jeynesbrook@pm.me" text="jeynesbrook@pm.me" /></li>
              </ul>
            </p>
        </div>

        <Command tag='p' command='' blink={true} />

        <div style={{paddingBottom: 50}} />
      </div>
    </div>
  );
}

export default About;
