

const API_URL = `http://localhost:3000/incluwork/ratings`;

export const postRating = async (jobId: string,  rating: number) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId, rating }),
    });

    if (!response.ok) {
        throw new Error('Failed to post rating');
    }

    return response.json();
};

export const getJobRatings = async (jobId: string, jobSeekerId: string) => {
    const response = await fetch(`${API_URL}?jobId=${jobId}&jobSeekerId=${jobSeekerId}`);
    if (!response.ok) {
        throw new Error('Failed to get job ratings');
    }

    return response.json();
};