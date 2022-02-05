# NewsChain
*Finalist (Winner of Justice Track)*  
*Most Ambitious Hack*  
Submission to UC Santa Cruz's CruzHacks 2022

## Inspiration
From pandemics to elections, misinformation has had a huge impact on every facet of life. And, with the rise of deep fakes, it becomes even harder to know what's real. How can we know if a news headline or image shared is actually legit? To solve that, we wanted to create a platform that could act as a ledger to verify if a piece of writing or media was produced by a trustworthy source. However, who should have the power to adminstrate it? When it comes to truth, *no individual* should be able to decide on it. Blockchain is thus the perfect solution to this problem. It is decentralized (no single person or entity can alter the information) and immutable (the information can't be removed or hidden).  This is especially important when it comes to journalism in authoritarian countries, where governments strive to censor. To truly achieve social justice, the people must have access to the truth.

Being both high school students with an interest in blockchain and ML, we wanted to tackle this issue fully. Much of this was also new to us, as this is the first time we've used Google Cloud's APIs! We present to you: **NewsChain**.

## What it does
NewsChain is a platform that saves, verifies, and searches for news articles and images associated with a certain publisher (such as the New York Times) to the blockchain. Publishers can upload an article title or a photo, both of which are converted into hashes (titles hashed with SHA256, images hashed with a Perceptual Hash) before being sent to a Smart Contract that stores the information. They can also upload the body text of the article, which isn't stored directly on the blockchain. Instead, we use Google's NLP API to perform sentiment analysis and content classification on the body text, and associate this data with the article on a separate database.

The address of all registered publishers along with their organization names are shown in a list. Users can then verify whether a news headline or a photo was actually released by a certain publisher in two ways. Firstly, if they have the news headline or the photo, they can directly check on the blockchain. However, if they don't have the headline and only have part of the article, they can still attempt to find it using its sentiment (whether it's a positive or negative article) and content type (genre), searching the database mentioned above. This essentially serves as a ML-powered search tool.

## How we built it
The frontend was built with **React**, and the backend server was built with **Express**. To hash images, files were sent to the backend and processed using the **multer** library, and hashed using the **imghash** library (the headlines were easily done using SHA256). The app was built on the Ethereum blockchain, using **Truffle** and the **Solidity** language to deploy smart contracts, and the **ethers.js** library and **Metamask** chrome extension to interact with them. The natural language processing was done via the **Google NLP API**, with the extra data stored in **mongoDB**.

We incorporated three main high-impact, **open-source** ecosystems.
1. Ethereum blockchain ecosystem, which included (open-source) libraries like **ethers.js** and **Truffle**
2. Image processing ecosystem, which included **imghash**, the implementation of the block mean perceptual hash algorithm
3. Web development ecosystem, which included the likes of **React** and **Express**

## Challenges we ran into
We ran into multiple challenges throughout. This was our first time sending files to the backend as well has hashing images, and it took us a long time to debug. Additionally, this was our first time using any of Google's APIs. And, we also ran into multiple strange bugs that occurred while setting up the Ganache and the local blockchain test environment.

## Accomplishments that we're proud of
We're proud to have accomplished a minimum viable product and to have used so much cool technology to solve a hugely important problem. All the features we planned to have are all there and working!

## What we learned
We learned a lot about transferring files, image manipulation, and natural language processing. We also learned about the hugely important problem of misinformation, and how blockchain could potentially provide a solution to that.

## What's next for NewsChain
If we had more time, we would have liked to put the NLP info stored on mongoDB and store it on IPFS instead, since it's a decentralized storage protocol that would have fit in with our goals more. We also want to find a way to store entire videos rather than just images.
