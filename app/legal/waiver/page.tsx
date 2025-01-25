// app/legal/waiver.tsx

export default function Waiver() {
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">
        Photo Release and Participation Waiver
      </h2>

      <p className="mb-4">
        In return for participating in the HackKU activities (“Activities”)
        offered at and conducted by ACM, a Club authorized by and affiliated
        with the University of Kansas, I agree:
      </p>

      <ul className="list-disc pl-6 mb-4">
        <li>
          I release The University of Kansas, the Kansas Board of Regents, the
          KU School of Engineering, HackKU, ACM@KU, and their respective
          employees, agents, officers, and contractors (“KU”) from any and all
          claims...
        </li>
        <li>
          I authorize HackKU to take, use and archive images and recordings of
          me alone or with other people...
        </li>
        <li>
          I authorize HackKU to use the Images free of charge at any time in the
          future in magazines, websites, commercials...
        </li>
        <li>This Release is governed by Kansas law.</li>
      </ul>

      <p className="mb-4">
        I HAVE READ, UNDERSTAND, AND VOLUNTARILY ACCEPT THE TERMS AND CONDITIONS
        OF THIS RELEASE.
      </p>

      {/* Parent/Guardian Consent for minors */}
    </div>
  );
}
