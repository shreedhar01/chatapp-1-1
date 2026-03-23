export function dateConverter(data: string) {
    const timestamp = !isNaN(Number(data)) ? Number(data) : data;
    const date = new Date(timestamp);

    if (isNaN(date.getTime())) {
        return "Invalid date";
    }

    const checkDate = new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
    const oneDay = 86400000;

    if (Number(new Date()) - checkDate.getTime() > oneDay) {
        return date.toLocaleDateString();
    } else {
        return date.toLocaleTimeString();
    }
}