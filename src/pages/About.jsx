import React, { useState, useEffect } from 'react';
import '../App.css';

import Arguments from '../components/Arguments';
import Command from '../components/Command';

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
      defaults: <a 
                  href="https://www.ssw.com.au/people/brook-jeynes" 
                  target="_blank" 
                  className="header-link-active"
                  rel="noreferrer noopener"
                >SSW - Software Developer</a>,
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
      defaults: <span>[ <a href="https://www.linkedin.com/in/brook-jeynes/" target="_blank" className="header-link-active" rel="noreferrer noopener">LinkedIn</a>, <a href="https://github.com/BrookJeynes" target="_blank" className="header-link-active" rel="noreferrer noopener">Github</a> ]</span>,
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
              While studying I'm also working as a <span className="text-yellow">Software Developer</span> at <a href="https://www.ssw.com.au/people/brook-jeynes" target="_blank" className="header-link-active" rel="noreferrer noopener">SSW</a> creating lots of cool products for companies using technologies such as <span className="text-yellow">React</span>, <span className="text-yellow">ASP.NET</span>, <span className="text-yellow">C#</span>, and many more. <br /> <br />
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
              The courses I've taken so far include:
              {/* TODO: Make this look nicer */}
              {/* TODO: Link to unit outline */}
              <ul className="list-disc list-inside">
                <li><span className="header-link-active">IFB102</span> Introduction to Computer Systems</li>
                <li><span className="header-link-active">IFB103</span> IT System Design</li>
                <li><span className="header-link-active">IFB104</span> Building IT Systems</li>
                <li><span className="header-link-active">IFB105</span> Database Management</li>
                <li><span className="header-link-active">CAB201</span> Programming Principles</li>
                <li><span className="header-link-active">CAB202</span> Microprocessors and Digital Systems</li>
                <li><span className="header-link-active">CAB240</span> Information Security</li>
                <li><span className="header-link-active">IAB207</span> Rapid Web Application Development</li>
                <li><span className="header-link-active">CAB203</span> Discrete Structures</li>
                <li><span className="header-link-active">CAB302</span> Software Development</li>
                <li><span className="header-link-active">CAB230</span> Web Computing</li>
                <li><span className="header-link-active">IAB230</span> Design of Enterprise IoT</li>
                <li><span className="header-link-active">CAB303</span> Networks</li>
                <li><span className="header-link-active">IFB295</span> IT Project Management</li>
                <li><span className="header-link-active">CAB432</span> Cloud Computing</li>
                <li><span className="header-link-active">IAB330</span> Applied IoT and Mobile Technologies</li>
              </ul>
            </p>
        </div>

        <Command tag='p' command='about-me --skills "Brook Jeynes"' blink={false} />

        <div className="about-me-response">
            <p>
              I've had exposure to a variety of programming languages and technologies such as:
              <ul className="list-disc list-inside">
                <li>C# (ASP.NET, Entity Framework)</li>
                <li>JavaScript (React, Node.js, Express, Bootstrap, HTML, CSS)</li>
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
                <li>linkedin - <a href="https://www.linkedin.com/in/brook-jeynes/" target="_blank" className="header-link-active" rel="noreferrer noopener">linkedin/brook-jeynes</a></li>
                <li>github - <a href="https://github.com/BrookJeynes" target="_blank" className="header-link-active" rel="noreferrer noopener">github/brookjeynes</a></li>
                <li>email - <a href="mailto:jeynesbrook@pm.me" target="_blank" className="header-link-active" rel="noreferrer noopener">jeynesbrook@pm.me</a></li>
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
