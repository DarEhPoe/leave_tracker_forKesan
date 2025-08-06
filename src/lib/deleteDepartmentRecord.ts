export async function deleteDepartment(id: number) {
    const res = await fetch("/api/delete-department", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
  
    if (!res.ok) {
      throw new Error("Failed to delete department");
    }
  
    return res.text(); // or res.json() if your response is JSON
  }
  