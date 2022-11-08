import React from 'react';
import '../App.css';

import Command from '../components/Command';
import Link from '../components/Link';

const SR2InteractiveMap = () => {
  return (
    <fieldset className="title-border project">
      <legend>SR2 Interactive Map</legend>
      <div className="project-header">
        <h1>Slime Rancher 2 Interactive Map</h1>
        <hr />
        <p>
          An interactive map where you can place custom icons and see the locations for a multitude of Slime Rancher 2 resources and points of interest. 
          A live version of the website can be found <Link link="https://brookjeynes.github.io/slime-rancher-2-interactive-map/" text="here" />.
        </p>
      </div>
      <div className="project-body">
        <div className="project-images">
          <img className="w-full md:w-3/4" src="https://github.com/BrookJeynes/slime-rancher-2-interactive-map/blob/main/assets/readme/map-example.png?raw=true" alt="map example" />
        </div>
  
        <div className="project-features-container">
          <div className="project-features mr-3">
            <fieldset className="title-border">
              <legend>Current Features</legend>
              <ul>
                <li>See locations for:</li>
                <ul className="ml-3">
                  <li>Gordo slimes</li>
                  <li>Bee drones (and the associated logs)</li>
                  <li>Map nodes</li>
                  <li>7-Zee treasure pods</li>
                  <li>Locked doors</li>
                </ul>
                <li>Place custom icons.</li>
                <li>Save custom icons to your browser cache.</li>
              </ul>
            </fieldset>
          </div>
          <div className="project-features ml-3">
            <fieldset className="title-border">
              <legend>Planned Features</legend>
              <ul>
                <li>Locations for:</li>
                <ul className="ml-3">
                  <li>Resource locations</li>
                  <li>Slime type locations</li>
                </ul>
              </ul>
            </fieldset>
          </div>
        </div>
      </div>
    </fieldset>
  );
};


const PixelArtMaker = () => {
  return (
    <fieldset className="title-border project">
      <legend>Pixel Art Maker</legend>
      <div className="project-header">
        <h1>Pixel Art Maker</h1>
        <hr />
        <p>Pixel Art Maker is a small website where you can create simple pixel art. This website is just a small project I decided to make to teach myself Typescript and better my ReactJS skills.</p>
      </div>
      <div className="project-body">
        <div className="project-images">
          <img className="w-full mb-3 md:w-[45%] md:mb-0" src="https://github.com/BrookJeynes/pixel-art-maker/blob/main/src/assets/readme/blank-canvas-example.png?raw=true" alt="Blank canvas example" />
          <img className="w-full md:w-[45%]" src="https://github.com/BrookJeynes/pixel-art-maker/blob/main/src/assets/readme/snail-example.png?raw=true" alt="Snail example" />
        </div>
        <div className="project-features-container mr-3">
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
          <div className="project-features ml-3">
            <fieldset className="title-border">
              <legend>Planned Features</legend>
              <ul>
                <li>Export other image formats</li>
                <li>PNG transparency option</li>
                <li>Save custom colours</li>
                <li>More tools:</li>
                <ul className="ml-3">
                  <li>Fill tool (bucket)</li>
                  <li>Clear canvas</li>
                </ul>
              </ul>
            </fieldset>
          </div>
        </div>
      </div>
    </fieldset>
  );
};

const Projects = () => {
  const projects = {
    "sr2-interactive-map": {
      name: "Slime Rancher 2 Interactive Map",
      link: "https://github.com/BrookJeynes/slime-rancher-2-interactive-map"
    },
    "pixel-art-maker": {
      name: "Pixel Art Maker",
      link: "https://github.com/BrookJeynes/pixel-art-maker"
    },
  }

  return (
    <div className="page-container">
      <div className="projects-container">
        <div className="project">
          <Command tag="p"
            command={<span>ls projects/</span>}
            blink={false}
            />

          <div className="flex flex-col md:flex-row justify-around my-5">
            { Object.keys(projects).map(key => {
              const project = projects[key];

              return (
                <div>
                  <Link link={project.link} text={key} />
                </div>
              )
            })
          }
          </div>
        </div>

        <div className="project">
          <Command tag='p' 
            command={<span>project --link <Link 
              link="https://github.com/BrookJeynes/slime-rancher-2-interactive-map" 
              text="https://github.com/brookjeynes/slime-rancher-2-interactive-map" />
            </span>} blink={false} />
          
          <SR2InteractiveMap />
        </div>

        <div className="project">
          <Command tag='p' 
            command={<span>project --link <Link
              link="https://github.com/BrookJeynes/pixel-art-maker" 
              text="https://github.com/brookjeynes/pixel-art-maker" />
            </span>} blink={false} />

          <PixelArtMaker />
        </div>

        <Command tag='p' command='' blink={true} />

        <div style={{paddingBottom: 50}} />
      </div>
    </div>
  );
}

export default Projects;
