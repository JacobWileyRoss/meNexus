import './HomeLayout.css'
import Header from "../Header/Header";
import Navigation from "../Navigation/Navigation";
import Activity from "../Activity/Activity";



const HomeLayout = ({children}) => {
    return (
        <div className='LayoutHome'>
            <Header color={'black'}/>
            <Navigation color={'black'}/>
            <main className='MainContentHome'>
                {children}
            </main>
            <Activity color={"white"}/>
        </div>
    );
}

export default HomeLayout;


