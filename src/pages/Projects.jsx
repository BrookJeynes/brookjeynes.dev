import React, { useState, useEffect } from 'react';
import '../App.css';

import Command from '../components/Command';

const Projects = () => {
  return (
    <div className="page-container">
      <div className="projects-container">
        <div className="project">
          <Command tag='p' 
            command={<span>projects --link <a target="_blank" className="header-link-active" rel="noreferrer noopener"
                href="https://github.com/BrookJeynes/pixel-art-maker">https://github.com/brookjeynes/pixel-art-maker</a></span>} blink={false} />
          
          <fieldset className="title-border project">
            <legend>Pixel Art Maker</legend>
            <div className="project-header">
              <h1>Pixel Art Maker - Created in React!</h1>
              <hr />
              <p>Pixel Art Maker is a small website where you can create simple pixel art. This website is just a small project I decided to make to teach myself Typescript and better my ReactJS skills.</p>
            </div>
            <div className="project-body">
              <div className="project-images">
                <img src="https://github.com/BrookJeynes/pixel-art-maker/blob/main/src/assets/readme/blank-canvas-example.png?raw=true" alt="Blank canvas example" />
                <img src="https://github.com/BrookJeynes/pixel-art-maker/blob/main/src/assets/readme/snail-example.png?raw=true" alt="Snail example" />
              </div>
              <div className="project-features-container">
                <div className="project-features">
                <fieldset className="title-border">
                  <legend>Current Features</legend>
                  <ul>
                    <li>Resize canvas & scale</li>
                    <li>Custom and pre-defined colours</li>
                    <li>Erase colours painted on the canvas</li>
                    <li>export images as a 'PNG' (not transparent)</li>
                  </ul>
                </fieldset>
                </div>
                <div className="project-features">
                  <fieldset className="title-border">
                    <legend>Planned Features</legend>
                    <ul>
                      <li>Export other image formats</li>
                      <li>PNG transparency option</li>
                      <li>Save custom colours</li>
                      <li>More tools:</li>
                        <ul>  
                          <li>Fill tool (bucket)</li>
                          <li>Clear canvas</li>
                        </ul>
                    </ul>
                  </fieldset>
                </div>
              </div>
              <div className="project-contribution"> 
                <h2>Contribution</h2>
                <p>Feel free to create a pull request and add some new features or create an issue and I'll see to it when I can. Any help is appreciated.</p>
              </div>
            </div>
          </fieldset>
        </div>

        <div className="project">
          <Command tag='p' 
            command={<span>projects --link <a target="_blank" className="header-link-active" rel="noreferrer noopener"
                href="https://github.com/BrookJeynes/subnet-calculator">https://github.com/brookjeynes/subnet-calculator</a></span>} blink={false} />
          
          <fieldset className="title-border project">
            <legend>Cli Subnetting Calculator</legend>
            <div className="project-header">
              <h1>Command-line Subnetting Calculator - Created in Python!</h1>
              <hr />
              <p>Scalc is a simple command-line subnet calculator. It can be used to generate markdown tables of subnet information. </p>
            </div>
            <div className="project-body">
              <h2>Usage</h2>
              <ol className="list-decimal list-inside">
                <li>Navigate into the project directory:</li>
                <div className="code-box">
                  cd subnet-calculator
                </div>
                <li>Install the module:</li>
                <div className="code-box">
                  pip install .
                </div>
                <li>Run the command-line tool:</li>
                <div className="code-box">
                  <pre>
{`❯ scalc --help 

Usage: scalc [OPTIONS] IP_ADDRESS

╭─ Arguments ──────────────────────────────────────────────────────────────────────────────────────────────╮
│ *    ip_address      TEXT  IP address. [default: None] [required]                                        │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────╯
╭─ Options ────────────────────────────────────────────────────────────────────────────────────────────────╮
│ --version         -v                 Show version.                                                       │ 
│ --slash-notation  -sn       INTEGER  Slash notation. Overrides --subnets. [default: 24]                  │
│ --subnets         -s        INTEGER  Number of subnets. [default: 2]                                     │
│ --output-format   -of       TEXT     Output format. Supported formats: terminal [default: terminal]      │
│ --help                               Show this message and exit.                                         │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────╯`}
                  </pre>
                </div>
                <li>Example output for <span>scalc 193.64.33.0 -s 4</span></li>
                <div className="code-box">
                  <pre>
{`|   Subnet | Network Address   | Slash Notation   | First Usable IP Address   | Last Usable IP Address   | Broadcast Address   |
|---------:|:------------------|:-----------------|:--------------------------|:-------------------------|:--------------------|
|        1 | \`193.64.33.0\`     | /26              | \`193.64.33.1\`             | \`193.64.33.62\`           | \`193.64.33.63\`      |
|        2 | \`193.64.33.64\`    | /26              | \`193.64.33.65\`            | \`193.64.33.126\`          | \`193.64.33.127\`     |
|        3 | \`193.64.33.128\`   | /26              | \`193.64.33.129\`           | \`193.64.33.190\`          | \`193.64.33.191\`     |
|        4 | \`193.64.33.192\`   | /26              | \`193.64.33.193\`           | \`193.64.33.254\`          | \`193.64.33.255\`     |`}
                  </pre>
                </div>
              </ol>
              <div className="project-features-container">
                <div className="project-features">
                <fieldset className="title-border">
                  <legend>Current Features</legend>
                  <ul>
                    <li>Subnet /24-/32 notation IP addresses</li>
                    <li>Generate markdown tables for the subnet information</li>
                  </ul>
                </fieldset>
                </div>
                <div className="project-features">
                  <fieldset className="title-border">
                    <legend>Planned Features</legend>
                    <ul>
                      <li>Subnet /8-/23 notation IP address</li>
                      <li>Export subnet information to a file</li>
                    </ul>
                  </fieldset>
                </div>
              </div>
              <div className="project-contribution"> 
                <h2>Contribution</h2>
                <p>Feel free to create a pull request and add some new features or create an issue and I'll see to it when I can. Any help is appreciated.</p>
              </div>        
            </div>
          </fieldset>
        </div>

        <Command tag='p' command='' blink={true} />

        <div style={{paddingBottom: 50}} />
      </div>
    </div>
  );
}

export default Projects;
