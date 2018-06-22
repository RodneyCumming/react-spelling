import React, { Component } from 'react';
import '../stylesheets/footer.css'
import Github from 'react-icons/lib/fa/github';

export function Footer(props) {
  return <div className="footer">
          <a href="https://github.com/devrod/react-spelling"><h2 className="footerText">Check out the github <span><Github className="githubIcon" /></span></h2></a>

        </div>
}
