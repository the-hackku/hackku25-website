import React from "react";
import "../assets/styles/CodeOfConduct.css";

const CodeOfConduct = () => {

  return (
    <div className="code-of-conduct">
      <h2 class="title">Code of Conduct</h2>  

      <p class="code-item">By attending HackKU, you agree to abide by the following Code of Conduct.</p>
      <ul class="code-list">
        <li class="code-item">
        Treat all other hackers with respect. Behave kindly and professionally. 
        Despite the competitive component of hackathons, understand that HackKU is, above all, a learning opportunity.
        </li>
        <li class="code-item">
        Treat all organizers, sponsors, mentors, judges, volunteers, and event hosts with respect. 
        Without them, HackKU would not be possible, so show that you appreciate them. 
        </li>
        <li class="code-item">
        Respect the University of Kansas’ facilities, as well as any others who may be on campus during HackKU. 
        This event is hosted at a university, and you will be expected to act in accordance with the relevant sections of the University of Kansas <a href="https://policy.ku.edu/student-affairs/student-code">Student Code</a>.    
        </li>
        <li class="code-item">
        Food, snacks, drinks, and swag will be available for free throughout the weekend. 
        Do not take more than your fair share or try to “cheat the system” to take more than you need.     
        </li>
        <li class="code-item">
        Harassment or discrimination based on any, or any combination of, the following grounds is strictly prohibited: age, religion, sex, sexual orientation, gender identity, gender expression, disability, race, ancestry, place of origin, ethnic origin, citizenship, color, age, and any other grounds that the law protects against. 
        All individuals are entitled to a respectful and inclusive environment free from any form of harassment or discrimination. 
        This policy applies to all areas of our operations and interactions.
        </li>
        <li class="code-item">
        As a Major League Hacking (MLH) Member Event, all participants will be expected to follow the MLH <a href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf">Code of Conduct</a>.    
        </li>
      </ul>

      <div id="warning-box" class="code-item">
        Failure to comply with any part of the above-stated Code of Conduct may result in disqualification and/or removal from the event. 
      </div>

      <h3 class="title">Photo Release</h3>

      <p class="code-item">
        By attending or participating in any HackKU event, you hereby grant HackKU permission to use your likeness in a photograph, video, or other digital media without payment or other consideration. 
        You understand and agree that all photos will become the property of HackKU. 
      </p>

    </div>
  );
};

export default CodeOfConduct;
