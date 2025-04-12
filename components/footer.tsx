import Link from "next/link";
import { Facebook, Twitter, Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Construction Estimator</h3>
            <p className="text-muted-foreground text-sm">
              Simplifying construction cost estimation for professionals and DIY
              enthusiasts.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://www.jainck.me/"
                className="text-muted-foreground hover:text-rose-500 transition-colors"
              >
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://twitter.com/jain_kuriakose"
                className="text-muted-foreground hover:text-rose-500 transition-colors"
              >
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="https://github.com/JainCK
"
                className="text-muted-foreground hover:text-rose-500 transition-colors"
              >
                <Github size={20} />
                <span className="sr-only">Github</span>
              </Link>
              <Link
                href="https://www.linkedin.com/in/jainck"
                className="text-muted-foreground hover:text-rose-500 transition-colors"
              >
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-rose-500 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/estimate"
                  className="text-muted-foreground hover:text-rose-500 transition-colors"
                >
                  Estimator
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-rose-500 transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-rose-500 transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-rose-500 transition-colors"
                >
                  Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-rose-500 transition-colors"
                >
                  Material Database
                </Link>
              </li>
              <li>
                <Link
                  href="/estimate"
                  className="text-muted-foreground hover:text-rose-500 transition-colors"
                >
                  Cost Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-rose-500 transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail size={16} />
                <span>support@constructionestimator.com</span>
              </li>
              <li className="text-muted-foreground">
                123 Builder Street
                <br />
                Construction City, CC 12345
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Construction Estimator. All rights
            reserved 2 JainCK.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-rose-500 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-rose-500 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
