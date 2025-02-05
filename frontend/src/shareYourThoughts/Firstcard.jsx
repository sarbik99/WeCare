import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button ";
import { Link } from 'react-router-dom';
import Hailpamon from "./Hailpamon";
import ShareYourThoughts from "./ShareYourThoughts";

export default function Firstcard() {
  return (
    <div className="flex justify-center">
      <Card className="w-96 p-6 shadow-lg rounded-2xl">
        <CardContent>
          <p className="text-lg font-semibold text-center">
            "Your Story Matters."
          </p>
          <p className="text-gray-700 mt-4 text-center">
            At WeCare, we believe that every voice has the power to inspire and heal. Sharing your journey can not only help you reflect and grow but also encourage someone else to take their first step toward healing.
          </p>
          <div className="mt-6 flex justify-center">
            <Link to='/ShareYourThoughts'>
                <Button>
                    Share your Story
                </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
