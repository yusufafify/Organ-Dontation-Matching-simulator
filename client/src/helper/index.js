export function calculateUrgency(recipient) {
  const recipientBMI = recipient.weight / recipient.height ** 2;
  let recipientBMIScore = 0;

  if (18.5 <= recipientBMI && recipientBMI <= 24.9) {
    recipientBMIScore += 8;
  } else if (25.0 <= recipientBMI && recipientBMI <= 29.9) {
    recipientBMIScore += 7;
  } else if (recipientBMI <= 18.5) {
    recipientBMIScore += 5;
  } else {
    recipientBMIScore += 2;
  }

  recipient.urgency += recipientBMIScore;
  if (recipient.disease) {
    recipient.urgency -= 5;
  }
}

export function calculateCompatibility(donor, recipient) {
  // Age Difference - Scale to a maximum impact of 5
  const ageDifferenceImpact = Math.max(
    0,
    5 - Math.abs(parseInt(donor.age) - parseInt(recipient.age)) / 10
  );

  // Blood Type Compatibility - Scale to a maximum impact of 3
  let bloodTypeCompatibility = 0;
  if (donor.bloodType === recipient.bloodType) {
    bloodTypeCompatibility = 4;
  } else if (donor.bloodType === "O") {
    bloodTypeCompatibility = 2; // O can donate to anyone
  }

  // Combine factors and cap the score at 10
  let score = ageDifferenceImpact + bloodTypeCompatibility;

  // Ensure the score does not exceed 10 and is non-negative
  return Math.min(Math.max(score, 0), 10);
}



export async function matchDonorsAndRecipients(donors, recipients) {
  const donorMap = {};

  // Organize donors by blood type and organ compatibility
  donors.forEach((donor) => {
    if (donor.disease === "no") {
      const key = `${donor.blood_type}-${donor.organ}`;
      if (!donorMap[key]) {
        donorMap[key] = [];
      }
      donorMap[key].push(donor);
    }
  });

  // Calculate urgency scores and sort recipients by urgency
  recipients.forEach((recipient) => calculateUrgency(recipient));
  recipients.sort((a, b) => b.urgency - a.urgency);

  const matches = [];

  // Match each recipient with the best compatible donor
  recipients.forEach((recipient) => {
    const key = `${recipient.blood_type}-${recipient.organ}`;
    let compatibleDonors = donorMap[key] || []; 

    // If no direct blood type match, add universal donors (blood type O)
    if (compatibleDonors.length === 0) {
      compatibleDonors = donorMap[`O-${recipient.organ}`] || [];
    } else {
      // Add universal donors as additional option if direct match exists
      compatibleDonors = [
        ...compatibleDonors,
        ...(donorMap[`O-${recipient.organ}`] || []),
      ];
    }

    if (compatibleDonors.length > 0) {
      // Sort donors by compatibility score for the current recipient
      compatibleDonors.sort(
        (a, b) =>
          calculateCompatibility(a, recipient) -
          calculateCompatibility(b, recipient)
      );
      const bestMatch = compatibleDonors.pop();
      const compatibilityScore = calculateCompatibility(bestMatch, recipient);

      // Save the match with compatibility score
      matches.push({
        donor: bestMatch,
        recipient,
        compatibilityScore,
      });

      // Remove the donor key if no more compatible donors are left
      const donorKey = `${bestMatch.blood_type}-${bestMatch.organ}`;
      donorMap[donorKey] = donorMap[donorKey].filter(
        (donor) => donor.id !== bestMatch.id
      );

      // Delete the key if no more donors of that type remain
      if (donorMap[donorKey].length === 0) {
        delete donorMap[donorKey];
      }
    }
  });

  return matches;
}



export async function benchmarkMatchFunction(donors, recipients) {
  const start = Date.now();
  const matches =  await matchDonorsAndRecipients(donors, recipients);
  const end = Date.now();
  const executionTime = end - start;

  // Analyze input size
  const donorCount = donors.length;
  const recipientCount = recipients.length;

  // Estimate time complexity
  // Complexity: O(n * m * log(m)) - where n is recipients, m is compatible donors
  const complexity = `O(n * m * log(m))`;

  return {
    matches,
    executionTime,
    complexity,
    donorCount,
    recipientCount,
  };
}