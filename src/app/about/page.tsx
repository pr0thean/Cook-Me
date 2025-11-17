import { Hero } from 'components/molecules/Hero'

export default function AboutPage() {
  return (
    <div>
      <Hero heading="About Cook Me" imageUrl="/assets/images/about.webp" />

      <div className="page-content-shadow mx-auto mt-6 w-11/12 rounded-xl bg-white p-5 text-black md:p-10">
        <div className="document">
          <p>
            Welcome to Cook Me, my personal digital cookbook where I store and share all my favorite
            recipes!
          </p>

          <h2>Our Story</h2>
          <p>
            Cook Me started as a hobby project, born from my dual passions: a love for delicious
            food and web development. As an enthusiastic home cook, I found myself constantly
            searching for a better way to organize my recipes and cooking adventures. That&apos;s
            when the idea for Cook Me was born.
          </p>

          <h2>What We Offer</h2>
          <p>
            Cook Me is more than just a recipe collection - it&apos;s a curated experience designed
            to make your culinary journey easier and more enjoyable. Here&apos;s what you can
            expect:
          </p>

          <ul>
            <li>
              <strong>Recipe Browsing</strong>: Explore our extensive collection of tried-and-true
              recipes.
            </li>
            <li>
              <strong>Smart Search</strong>: Quickly find exactly what you&apos;re looking for with
              our powerful search function.
            </li>
            <li>
              <strong>Filters</strong>: Easily narrow down recipes by category, difficulty level, or
              specific tags
            </li>
          </ul>

          <h2>Behind the Scenes</h2>
          <p>
            While Cook Me is all about great food on the surface, it&apos;s powered by some pretty
            cool technology under the hood:
          </p>

          <ul>
            <li>Built with Next.js and TypeScript for a fast, modern web experience</li>
            <li>Styled using Tailwind CSS for a clean, responsive design</li>
            <li>
              Content managed through Contentful CMS, making it easy to keep recipes up-to-date
            </li>
            <li>GraphQL for efficient data querying</li>
            <li>Rigorously tested using Cypress for both end-to-end and component testing</li>
          </ul>

          <h2>Join Me on This Culinary Adventure</h2>

          <p>
            Whether you&apos;re a seasoned chef or just starting out in the kitchen, I hope Cook Me
            inspires you to try new recipes, experiment with flavors, and most importantly, enjoy
            the process of creating delicious meals.
          </p>

          <p>Happy cooking!</p>

          <p>Jakub Wolak</p>
        </div>
      </div>
    </div>
  )
}
