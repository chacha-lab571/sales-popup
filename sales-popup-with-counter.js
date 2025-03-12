(function () {
    // Configuration
    const STORE_DOMAIN = window.Shopify.shop; // Auto-detects store domain
    const API_TOKEN = "YOUR_STOREFRONT_API_TOKEN"; // Replace with your Storefront API token
    const UPDATE_INTERVAL = 10000; // Refresh every 10 seconds
  
    // Simulated visitor count
    let visitorCount = Math.floor(Math.random() * 30) + 5; // Start with random 5-35
  
    // Fetch recent sales via Storefront API (GraphQL)
    async function fetchRecentSales() {
      const query = `
        {
          orders(first: 1, sortKey: CREATED_AT, reverse: true) {
            edges {
              node {
                lineItems(first: 1) {
                  edges {
                    node {
                      title
                    }
                  }
                }
              }
            }
          }
        }
      `;
      try {
        const response = await fetch(`https://${STORE_DOMAIN}/api/2023-10/graphql.json`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": API_TOKEN,
          },
          body: JSON.stringify({ query }),
        });
        const data = await response.json();
        return (
          data.data.orders.edges[0]?.node.lineItems.edges[0]?.node.title || "No recent sales"
        );
      } catch (error) {
        console.error("Error fetching sales:", error);
        return "No recent sales";
      }
    }
  
    // Simulate visitor count updates
    function updateVisitorCount() {
      visitorCount += Math.floor(Math.random() * 3) - 1; // Fluctuate by -1 to +1
      if (visitorCount < 0) visitorCount = 0; // Prevent negative
    }
  
    // Create or update popup
    function createOrUpdatePopup(saleItem) {
      let popup = document.getElementById("sales-visitor-popup");
      if (!popup) {
        popup = document.createElement("div");
        popup.id = "sales-visitor-popup";
        popup.style.cssText = `
          position: fixed; bottom: 20px; left: 20px; background: #fff;
          border: 1px solid #ddd; padding: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          z-index: 1000; max-width: 280px; font-family: Arial, sans-serif; border-radius: 5px;
        `;
        document.body.appendChild(popup);
      }
      popup.innerHTML = `
        <h3 style="margin: 0 0 8px; font-size: 16px; color: #333;">Live Activity</h3>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Visitors Now:</strong> ${visitorCount}</p>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Latest Sale:</strong> ${saleItem}</p>
        <button style="background: #ff4444; color: #fff; border: none; padding: 6px 12px; cursor: pointer; border-radius: 3px;"
          onclick="this.parentElement.style.display='none'">Close</button>
      `;
    }
  
    // Initialize and refresh popup
    async function initPopup() {
      const saleItem = await fetchRecentSales();
      createOrUpdatePopup(saleItem);
  
      setInterval(async () => {
        updateVisitorCount();
        const newSaleItem = await fetchRecentSales();
        createOrUpdatePopup(newSaleItem);
      }, UPDATE_INTERVAL);
    }
  
    // Start when page loads
    if (document.readyState === "complete") {
      initPopup();
    } else {
      window.addEventListener("load", initPopup);
    }
  })();
  