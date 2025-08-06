export async function deleteEmployee(id: number) {
    const res = await fetch("/api/delete-employee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
  
    if (!res.ok) {
      throw new Error("Failed to delete tracker");
    }
  
    return res.text(); // or res.json() if your response is JSON
  }
  