//https://freefrontend.dev/code/bootstrap/about-us/about-us-section-template/

import Link from "next/link";


export default function AboutBox() {

    return (
    <section className="py-5">
        <div className="container">
            <div className="row align-items-center gx-4">
                <div className="col-md-5">
                    <div className="ms-md-2 ms-lg-5">
                        <img
                            className="img-fluid rounded-3"
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Common_mime_%28Papilio_clytia%29_form_dissimilis_in_flight_Luang_Prabang.jpg/1920px-Common_mime_%28Papilio_clytia%29_form_dissimilis_in_flight_Luang_Prabang.jpg"
                        />
                    </div>
                </div>
                <div className="col-md-6 offset-md-1">
                    <div className="ms-md-2 ms-lg-5">
                        <span className="text-muted">My Story</span>
                        <h2 className="display-5 fw-bold">About Anuoluwa</h2>
                        <p className="lead">
                            Anuoluwa is a junior at Grand Canyon University, studying software development.
                            She will graduate with her bachelor's degree in Spring 2027.
                        </p>
                        <Link href="/" className="btn btn-primary"> Home</Link>
                    </div>
                </div>
            </div>
        </div>
    </section>
    );
}