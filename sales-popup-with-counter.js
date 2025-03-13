(function () {
    // Ensure script runs inside a Shopify store
    if (!window.Shopify || !window.Shopify.shop) {
        console.error("Shopify store domain is missing. Ensure the script runs inside a Shopify store.");
        return;
    }

    // Configuration
    const BACKEND_URL = "https://your-backend-url.com"; // Replace with deployed backend URL
    const UPDATE_INTERVAL = 10000; // Refresh every 10 seconds
    const DISPLAY_DURATION = 5000; // Each popup stays for 5s

    // Simulated visitor count
    let visitorCount = Math.floor(Math.random() * 30) + 5; // Start with random 5-35

    let currentSaleIndex = 0;
    let salesData = [];

    // Fetch recent sales from backend
    async function fetchRecentSales() {
        try {
            const response = await fetch(`${BACKEND_URL}/recent-sales`);
            const data = await response.json();
            salesData = data.orders || [];
        } catch (error) {
            console.error("Error fetching sales:", error);
        }
    }

    // Simulate visitor count updates
    function updateVisitorCount() {
        visitorCount += Math.floor(Math.random() * 3) - 1; // Fluctuate by -1 to +1
        if (visitorCount < 0) visitorCount = 0; // Prevent negative
    }

    // Create or update popup
    function showPopup() {
        if (salesData.length === 0) return;

        let order = salesData[currentSaleIndex];
        currentSaleIndex = (currentSaleIndex + 1) % salesData.length; // Rotate through sales

        let popup = document.getElementById("sales-visitor-popup");
        if (!popup) {
            popup = document.createElement("div");
            popup.id = "sales-visitor-popup";
            popup.style.cssText = `
                position: fixed; bottom: 20px; left: 20px; background: #fff;
                border: 1px solid #ddd; padding: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                z-index: 1000; max-width: 300px; font-family: Arial, sans-serif; border-radius: 5px;
                display: flex; align-items: center;
            `;
            document.body.appendChild(popup);
        }

        popup.innerHTML = `
            <img src="${order.productImage}" alt="Product Image" style="width: 50px; height: 50px; border-radius: 5px; margin-right: 10px;">
            <div>
                <p style="margin: 5px 0; font-size: 14px;">
                    <strong>${order.customerName}</strong> in <strong>${order.location}</strong> purchased <strong>${order.productName}</strong> <br>
                    <small style="color: gray;">${order.timeAgo}</small>
                </p>
            </div>
            <button style="background: #ff4444; color: #fff; border: none; padding: 4px 8px; cursor: pointer; border-radius: 3px; margin-left: auto;"
                onclick="document.getElementById('sales-visitor-popup').remove()">✕</button>
        `;

        popup.style.display = "block";
        setTimeout(() => {
            popup.style.display = "none";
        }, DISPLAY_DURATION);
    }

    // Initialize popup system
    async function initPopup() {
        await fetchRecentSales();
        setInterval(async () => {
            updateVisitorCount();
            await fetchRecentSales();
            showPopup();
        }, UPDATE_INTERVAL);
        showPopup(); // Show first popup immediately
    }

    // Start when page loads
    if (document.readyState === "complete") {
        initPopup();
    } else {
        window.addEventListener("load", initPopup);
    }
})();
