import React from "react";

const Header = ({color, textColor, fontSize}) => {
    return (
    <header className='meNexusHeader' style={{backgroundColor:color, color:textColor, fontSize:fontSize}}>
        {/* Header content */}
        meNexus
    </header>
    )
};

export default Header;