import { Shell } from '@/components/shell'

export default function FaqsPage() {
  return (
    <Shell>
      <section className="max-w-2xl mx-auto py-10">
        <h1 className="text-4xl font-bold mb-6">FAQs & Recipe Submission Guide</h1>
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-2">How do I add a recipe?</h2>
            <p>
              To add a recipe, navigate to the "Add Recipe" page and fill out the required fields such as name, category, ingredients, steps, and images.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">How should I format the steps?</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Use new lines or hyphens (-)</strong> to separate each step.
                <div className="mt-2 bg-muted p-3 rounded text-sm">
                  Example:<br />
                  <code>
                    Preheat the oven to 180°C.<br />
                    - Mix flour and sugar.<br />
                    - Add eggs and stir.<br />
                    - Pour into a pan and bake for 30 minutes.
                  </code>
                </div>
              </li>
              <li>
                <strong>To make text bold</strong>, wrap it in double asterisks: <code>**like this**</code>.
                <div className="mt-2 bg-muted p-3 rounded text-sm">
                  Example:<br />
                  <code>
                    - **Preheat** the oven to 180°C.<br />
                    - Mix **flour** and **sugar**.
                  </code>
                </div>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">How do I format ingredients?</h2>
            <p>
              List each ingredient with its quantity and units. For example: <br />
              <span className="bg-muted px-2 py-1 rounded text-sm">2 cups of flour</span>
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Can I add images?</h2>
            <p>
              Yes! You can upload one or more images to showcase your recipe.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Need more help?</h2>
            <p>
              If you have any questions or need assistance, please contact us via the feedback form or reach out on our social channels.
            </p>
          </div>
        </div>
      </section>
    </Shell>
  )
}
