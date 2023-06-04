import './RegisterLayout.css'

const RegisterLayout = ({children}) => {
    return (
        <div className='LayoutRegister'>
            <header>
                enkitheymystik.com
            </header>
            <main className='MainContentLogin'>
                {children}
            </main>
        </div>
    );
}

export default RegisterLayout;


