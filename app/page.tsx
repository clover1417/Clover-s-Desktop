"use client";

import React from 'react';
import { Triangle } from '@/app/components/Shapes/triangle';
import { Plus } from '@/app/components/Shapes/plus';
import { Circle } from '@/app/components/Shapes/circle';
import { Window } from '@/app/components/Window';
import { AppIcon } from '@/app/components/ApplicationWindows/AppIcon';
import { Widget } from '@/app/components/Widgets/Widget';
import { MusicPlayer } from '@/app/components/Widgets/MusicPlayer';
import { QuickAccess } from '@/app/components/QuickAccess';
import { VolumeProvider } from '@/app/context/VolumeContext';
import Image from "next/image";

export default function Home() {
  return (
    <VolumeProvider>
      <main style={{ zIndex: 0 }}>
        <div className='sm:hidden'>
          
        </div>
        <div className="inner-box" />
        <div className="logo-container">
          <Image
            src="/assets/LogoNoShadow.png"
            alt="Clover Logo"
            width={440}
            height={249}
            priority
          />
        </div>

      <div className="pattern-container">
        <div className="top-nav" />
        <div className="shapes-container">
            <Circle top="-86px"  left="780px"  size="307px" />
            <Circle top="-86px"  left="1190px" size="298px" />
            <Circle top="-36px"  left="895px"  size="307px" />
            <Circle top="-20px"  left="1065px" size="298px" />
            <Circle top="-3px"   left="-120px" size="344px" />
            <Circle top="52px"   left="156px"  size="200px" />
            <Circle top="60px"   left="1445px" size="77px"  />
            <Circle top="80px"   left="2070px" size="242px" />
            <Circle top="82px"   left="1982px" size="174px" />
            <Circle top="105px"  left="1596px" size="123px" />
            <Circle top="145px"  left="650px"  size="83px"  />
            <Circle top="228px"  left="850px"  size="49px"  />
            <Circle top="304px"  left="2035px" size="36px"  />
            <Circle top="468px"  left="2092px" size="227px" />
            <Circle top="499px"  left="1596px" size="165px" />
            <Circle top="777px"  left="955px"  size="244px" />
            <Circle top="780px"  left="-112px" size="200px" />
            <Circle top="809px"  left="390px"  size="143px" />
            <Circle top="858px"  left="1706px" size="83px"  />
            <Circle top="994px"  left="1986px" size="451px" />
            <Circle top="1063px" left="314px"  size="411px" />
            <Circle top="1118px" left="970px"  size="36px"  />

            {/* Plus signs */}
            <Plus   top="480px"  left="360px"  size="80px"  rotation="-100deg"/>
            <Plus   top="650px"  left="660px"  size="56px" rotation="50deg"/>
            <Plus   top="750px"  left="1960px" size="110px" rotation="-4deg"/>
            <Plus   top="1025px" left="150px"  size="80px"  rotation="30deg"/>
            <Plus   top="1090px" left="1320px" size="80px"  rotation="-70deg"/>

            {/* Triangles */}
            <Triangle top="280px"  left="492px"  scale="40px" rotation="-40deg"/>
            <Triangle top="280px"  left="1809px" scale="24px" rotation="40deg"/>
            <Triangle top="520px"  left="88px"   scale="28px" rotation="-20deg"/>
            <Triangle top="1110px" left="1777px" scale="32px" rotation="40deg"/>
        </div>
      </div>

      {/* Desktop Window */}
      <div className="desktop-window">
        <Window>
          {/* Desktop icons */}
          <div className="app-icon-container">
            <AppIcon name="about" icon="About" top="5px" left="20px" />
            <AppIcon name="patreon" icon="Resource" top="5px" left="80px" />
            <AppIcon name="works" icon="Works" top="70px" left="20px" />
            <AppIcon name="wiki" icon="Wiki" top="70px" left="80px" />
            <AppIcon name="gallery" icon="Gallery" top="135px" left="20px" />
            <AppIcon name="stuff" icon="Stuff" top="135px" left="80px" />
            <AppIcon name="contact" icon="Contact" top="200px" left="20px" />
            <AppIcon name="upload" icon="Upload" top="200px" left="80px" />
          </div>
          
          {/* Widgets */}
          <div className="widget-container">
            <Widget 
              type="wigetsmith" 
              top="15px" 
              left="-285px" 
            />
            
            <MusicPlayer 
              top="15px" 
              left="-165px"
            />
          </div>
          
          {/* QuickAccess Bar */}
          <div className="quick-access-container">
            <QuickAccess top="-65px" left="-60px" />
          </div>
        </Window>
      </div>

      <div className="bottom-bar" />
      <div className="copyright-container">
        © Clover Jam – 2025
      </div>
    </main>
    </VolumeProvider>
  )
}

