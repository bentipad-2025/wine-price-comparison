export async function searchWine(searchTerm) {
  const mockData = [
    {
      name: "Penfolds Bin 389",
      retailers: [
        { name: "Dan Murphy's", price: 100.00, link: "https://www.danmurphys.com.au" },
        { name: "First Choice", price: 105.00, link: "https://www.firstchoice.com.au" }
      ]
    },
    {
      name: "Yellow Tail Shiraz",
      retailers: [
        { name: "Dan Murphy's", price: 8.00, link: "https://www.danmurphys.com.au" },
        { name: "First Choice", price: 8.50, link: "https://www.firstchoice.com.au" }
      ]
    }
  ];

  return mockData.filter(wine => 
    wine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}
