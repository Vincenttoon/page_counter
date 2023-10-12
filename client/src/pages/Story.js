import React from 'react';
import '../styles/Story.scss';

import { FaHeart, FaBook, FaDatabase } from 'react-icons/fa'


const Story = () => {
    

    return (
        <div className='main-story'>
            <div className='story-div-1'>
                <h2 className='thanks'> Thank you for visiting Page Counter.</h2>
                <h4> Whether this is your first visit or you're a regular book worm, your support does not go unnoticed</h4>
                <h1 className='icon'> <FaHeart /> </h1>
            </div>

            <div className='story-div-2'>
                <p> This application was designed for somebody very special to me.</p>
                <h1 className='icon'><FaBook /> <FaDatabase /> </h1>
                <p> She wanted more accurate data of her reading habits </p>
                <h2 className='thus'>Thus, this application</h2>
            </div>

            <div className='story-div-3'>
                <h3>Please enjoy your time on Page Counter</h3>
                <p>If you liked this application, please checkout my other work on my <a href='https://github.com/Vincenttoon'>Github</a> and my <a href='https://vincent-toon-portfolio.vercel.app/'>Portfolio</a></p>
            </div>
        </div>
    )
}

export default Story;