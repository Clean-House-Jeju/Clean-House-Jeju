
export default function filterKeyword(data, keyword) {
    data = data.filter(d => d.location.toLowerCase().includes(keyword))
    return data.sort((a,b) => {
        return a.distance - b.distance;
    });
};
