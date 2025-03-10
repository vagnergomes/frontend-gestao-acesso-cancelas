import Header from '../components/Menu/Header';

export const Home = () => {

    return (
        <div className="Flex min-h-screen bg-slate-100 dark:bg-slate-900 flex justify-around px-4">
            <Header />

            <main className='mt-32 w-full bg-slate-100 dark:bg-slate-900 '>
                <section className="pl-16 lg:pl-64 text-center">
                <p>Seja Bem-vido!</p>              
                </section>
            </main>
        </div>
    )
}