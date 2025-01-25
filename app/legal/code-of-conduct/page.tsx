import Link from "next/link";

export default function CodeOfConduct() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-center">Code of Conduct</h1>
        <p className="mb-4">
          By attending HackKU 2025, you agree to abide by the following Code of
          Conduct:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-lg">
          <li>
            Treat all other hackers with respect. Behave kindly and
            professionally. Despite the competitive component of hackathons,
            understand that HackKU is, above all, a learning opportunity.
          </li>
          <li>
            Treat all organizers, sponsors, mentors, judges, volunteers, and
            event hosts with respect. Without them, HackKU would not be
            possible, so show that you appreciate them.
          </li>
          <li>
            Respect the University of Kansas’ facilities, as well as any others
            who may be on campus during HackKU. This event is hosted at a
            university, and you will be expected to act in accordance with the
            relevant sections of the University of Kansas Student Code.
          </li>
          <li>
            Food, snacks, drinks, and swag will be available for free throughout
            the weekend. Do not take more than your fair share or try to “cheat
            the system” to take more than you need.
          </li>
          <li>
            Harassment or discrimination based on any, or any combination of,
            the following grounds is strictly prohibited: age, religion, sex,
            sexual orientation, gender identity, gender expression, disability,
            race, ancestry, place of origin, ethnic origin, citizenship, color,
            age, and any other grounds that the law protects against. All
            individuals are entitled to a respectful and inclusive environment
            free from any form of harassment or discrimination. This policy
            applies to all areas of our operations and interactions.
          </li>
          <li>
            As a Major League Hacking (MLH) Member Event, all participants will
            be expected to follow the{" "}
            <Link
              href="https://mlh.io/code-of-conduct"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              MLH Code of Conduct
            </Link>
            .
          </li>
        </ul>
        <p className="mt-4 text-lg font-semibold">
          Failure to comply with any part of the above-stated Code of Conduct
          may result in disqualification and/or removal from the event.
        </p>
      </div>
    </div>
  );
}
