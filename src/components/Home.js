import React, { Component } from 'react';
import { Link } from 'react-router-dom'

export default function Home(props) {
  return <div>
          <h1>Home</h1>
          <Link to='/spelling'>
            <h2>spelling</h2>
          </Link>
        </div>
}
