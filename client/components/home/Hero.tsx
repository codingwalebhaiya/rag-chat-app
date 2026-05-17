
//export default function Hero() { return <section className='container mx-auto px-4 py-20 text-center'><span className='rounded-full border px-3 py-1 text-xs'>AI Powered Knowledge Assistant</span><h1 className='mt-6 text-4xl md:text-6xl font-bold tracking-tight'>Turn Documents Into <span className='text-primary'>Instant Answers</span></h1><p className='mx-auto mt-6 max-w-2xl text-muted-foreground'>Upload PDFs, docs, and knowledge bases. Chat with your files using advanced Retrieval Augmented Generation.</p><div className='mt-8 flex justify-center gap-3'><button className='rounded-xl bg-primary px-6 py-3 text-primary-foreground'><Link href={"/login"} >Start Free Trial</Link> </button><button className='rounded-xl border px-6 py-3'>Watch Demo</button></div></section> }

import Link from "next/link"

const Hero = () => {
    return (
        <section className='container mx-auto px-4 py-20 text-center'>
            <span className='rounded-full border px-3 py-1 text-xs'>AI Powered Knowledge Assistant</span>
            <h1 className='mt-6 text-4xl md:text-6xl font-bold tracking-tight'>Turn Documents Into
                <span className='text-primary'>Instant Answers</span>
            </h1>
            <p className='mx-auto mt-6 max-w-2xl text-muted-foreground'>Upload PDFs, docs, and knowledge bases. Chat with your files using advanced Retrieval Augmented Generation.</p>
            <div className='mt-8 flex justify-center gap-3'>
                <button className='rounded-xl bg-primary px-6 py-3 text-primary-foreground'>
                    <Link href={"/dashboard"} >Start Free Trial</Link>
                </button>
                <button className='rounded-xl border px-6 py-3'>Watch Demo</button>
            </div>
        </section>
    )
}

export default Hero;