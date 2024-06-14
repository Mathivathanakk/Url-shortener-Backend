import urlShortener from "../Models/urlModel.js";
import { nanoid } from "nanoid";
import { startOfMonth } from "date-fns";
import { endOfMonth } from "date-fns/endOfMonth";
import { startOfDay } from "date-fns/startOfDay";

export const createShortUrl = async (req, res) => {
  try {
    const { fullurl } = req.body;
    // console.log(url);
    if (!fullurl) {
      res.status(400).json({ message: "url is requied" });
    }

    const shortId = nanoid(8);
    const newUrl = new urlShortener({
      fullurl: fullurl,
      shorturl: shortId,
      user: req.user._id,
      date: Date.now(),
    });
    newUrl.save();
    // console.log(newUrl);
    res
      .status(200)
      .json({ message: "Shorturl created successfully", urldetails:newUrl });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server error in creating the  short url" });
  }
};

export const redirectShortUrl = async (req, res) => {
  try {
    const shortId = req.params.shortId;
    if (!shortId) {
      res.status(404).json({ message: "Shorturl Not Found" });
    }
    const findurl = await urlShortener.findOne({ shorturl: shortId });
    findurl.totalClick++;
    findurl.save();
    //console.log(findurl);

    res.redirect(findurl.fullurl);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server error in updating and redirect to the  url",
    });
  }
};

export const urlCalculation = async (req, res) => {
  try {
    const today = new Date();

    const thisDay = startOfDay(today);
    const firstDateOfMonth = startOfMonth(today);
    const lastDateOfMonth = endOfMonth(today);
    //get the per day url created
    const todayUrl = await urlShortener.countDocuments({
      date: { $gte: thisDay },
    });
    //get the per month url created
    const monthUrl = await urlShortener.countDocuments({
      date: { $gte: firstDateOfMonth, $lte: lastDateOfMonth },
    });
    //get the url created list and sorted by ascending order of totalclick

    const urlList = await urlShortener.find().sort({ totalClick: 1 });

    res
      .status(200)
      .json({ urlperday: todayUrl, urlpermonth: monthUrl, urllist: urlList });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server error in getting url count per day and month",
    });
  }
};
