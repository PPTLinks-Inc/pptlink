function formatDate(date: string | Date) {
    date = new Date(date);
    const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    // Add suffix for the day
    const day = date.getDate();
    const suffix = (day: number) => {
        if (day > 3 && day < 21) return "th"; // Special case for 11-13
        return ["th", "st", "nd", "rd"][day % 10] || "th";
    };

    return formattedDate.replace(/\d+/, day + suffix(day));
}

export default formatDate;