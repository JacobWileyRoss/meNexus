import './LoginLayout.css'

const LoginLayout = ({children}) => {
    return (
        <div className='LayoutLogin'>
            <header>
                meNexus
            </header>
            <main className='MainContentLogin'>
                {children}
            </main>
        </div>
    );
}

export default LoginLayout;


