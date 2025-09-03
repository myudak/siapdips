import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Star, Download } from "lucide-react";
import { motion } from "motion/react";
import { ResumeTemplate } from "./resume-data";

const ResumeDialog = ({
  selectedResume,
}: {
  selectedResume: ResumeTemplate;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <DialogHeader>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <DialogTitle className="text-2xl">{selectedResume.title}</DialogTitle>
          <DialogDescription className="text-lg">
            {selectedResume.description}
          </DialogDescription>
        </motion.div>
      </DialogHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <img
            src={selectedResume.imageUrl}
            alt={selectedResume.title}
            className="w-full rounded-lg shadow-lg"
          />
        </motion.div>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.4,
            }}
          >
            {/* <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                </motion.div>
                <span className="font-semibold">{selectedResume.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Download className="h-4 w-4" />
                </motion.div>
                <span className="text-sm text-muted-foreground">
                  {selectedResume.downloads} downloads
                </span>
              </div>
            </div> */}

            {selectedResume.category &&
              selectedResume.category.length > 0 &&
              selectedResume.category.map((cat, index) => (
                <motion.div
                  key={index}
                  className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {cat}
                </motion.div>
              ))}
            {/* <motion.div
                                          className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4"
                                          whileHover={{ scale: 1.05 }}
                                          transition={{ duration: 0.2 }}
                                        >
                                          {selectedResume.category}
                                        </motion.div> */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.5,
            }}
          >
            <h3 className="font-semibold text-lg mb-3">Key Features</h3>
            <ul className="space-y-2">
              {selectedResume.features.map((feature, index) => (
                <motion.li
                  key={index}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.6 + index * 0.1,
                  }}
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    className="w-2 h-2 bg-primary rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  />
                  <span className="text-sm">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.7,
            }}
          >
            <h3 className="font-semibold text-lg mb-3">Professional Tips</h3>
            <ul className="space-y-2">
              {selectedResume.tips.map((tip, index) => (
                <motion.li
                  key={index}
                  className="text-sm text-muted-foreground"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.8 + index * 0.1,
                  }}
                >
                  • {tip}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="flex gap-3 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.9,
            }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" asChild>
                <a
                  href={selectedResume.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Preview
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResumeDialog;
