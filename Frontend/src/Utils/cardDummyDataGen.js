const cardDummyDataGen = (number, isDescription) => {
    let data = [];
    for (let i = 1; i < number + 1; i++) {
      let videoData = {
        videoId: i,
        title: `Video ${i}`,
        thumbnail: "https://placehold.co/600x400",
        uploader: `Uploader ${i}`,
      };

      if (isDescription) {
        videoData.description = `( Description ${i} ) Lorem ipsum dolor sit, amet consectetur adipisicing elit. Porro laboriosam nihil impedit, possimus reiciendis ullam corrupti eaque, aperiam error inventore optio voluptatum omnis quod necessitatibus accusantium debitis fugiat. Obcaecati eligendi eaque corrupti dolorum ab laborum cupiditate nisi blanditiis minus aperiam?`;
      }

      data.push(videoData);
    }
    return data;
  };

  export default cardDummyDataGen;